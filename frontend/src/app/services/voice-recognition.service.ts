import { Injectable, NgZone, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class VoiceRecognitionService {
  private zone = inject(NgZone);
  private recognition: any = null;
  private finalText = '';
  private pending = ''; // text from a session that ended on its own
  private resolveStop: ((text: string) => void) | null = null;

  readonly supported: boolean;
  listening = false;
  lastError: string | null = null;

  constructor() {
    const Ctor = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    this.supported = !!Ctor;
    if (!Ctor) return;

    const r = new Ctor();
    r.continuous = true;      // keep listening until stop() is called
    r.interimResults = false; // only final results, so nothing half-heard is kept
    r.maxAlternatives = 1;

    r.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) this.finalText += event.results[i][0].transcript + ' ';
      }
    };

    r.onerror = (event: any) => {
      this.lastError = event.error; // e.g. 'not-allowed', 'no-speech', 'audio-capture'
    };

    // The 'end' event arrives after the last result, so this is the right moment to hand text over
    r.onend = () => {
      this.listening = false;
      const text = this.finalText.trim();
      this.finalText = '';
      const resolve = this.resolveStop;
      this.resolveStop = null;
      if (resolve) this.zone.run(() => resolve(text));
      else this.pending = text; // recognition stopped by itself (silence timeout)
    };

    this.recognition = r;
  }

  // Returns false if it could not start (unsupported, or already running)
  start(lang = 'en-US'): boolean {
    if (!this.recognition || this.listening) return false;
    this.finalText = '';
    this.pending = '';
    this.lastError = null;
    this.recognition.lang = lang;
    try {
      this.recognition.start();
      this.listening = true;
      return true;
    } catch {
      return false;
    }
  }

  // Resolves with everything that was said, once the browser has delivered the last result
  stop(): Promise<string> {
    if (!this.recognition) return Promise.resolve('');

    if (!this.listening) {
      const text = this.pending;
      this.pending = '';
      return Promise.resolve(text);
    }

    return new Promise((resolve) => {
      this.resolveStop = resolve;
      this.recognition.stop();
      // Safety net in case the browser never fires 'end'
      setTimeout(() => {
        if (this.resolveStop === resolve) {
          this.resolveStop = null;
          this.listening = false;
          resolve(this.finalText.trim());
        }
      }, 3000);
    });
  }
}