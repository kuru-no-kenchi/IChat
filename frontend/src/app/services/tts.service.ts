import { Injectable, NgZone, inject, signal } from '@angular/core';
import { LanguageService } from './language.service';

@Injectable({ providedIn: 'root' })
export class TtsService {
  private zone = inject(NgZone);
  private language = inject(LanguageService);

  readonly supported = 'speechSynthesis' in window;
  readonly speaking = signal<string | null>(null); // the text currently being read

  toggle(text: string) {
    if (this.speaking() === text) this.stop();
    else this.speak(text);
  }

  speak(text: string) {
    if (!this.supported || !text.trim()) return;
    const synth = window.speechSynthesis;
    synth.cancel(); // never stack two readings

    const lang = this.language.speechLang;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voices = synth.getVoices();
    const voice =
      voices.find((v) => v.lang === lang) ?? voices.find((v) => v.lang.startsWith(lang.slice(0, 2)));
    if (voice) utterance.voice = voice;

    const done = () => this.zone.run(() => { if (this.speaking() === text) this.speaking.set(null); });
    utterance.onend = done;
    utterance.onerror = done;

    this.speaking.set(text);
    synth.speak(utterance);
  }

  stop() {
    if (!this.supported) return;
    window.speechSynthesis.cancel();
    this.speaking.set(null);
  }
}