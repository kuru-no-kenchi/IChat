import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service'; // adjust the path if needed

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: { user: string; text: string }[] = [];
  messageHistory: { role: string; content: string }[] = [];

  constructor(private chatService: ChatService) {}

  sendMessage(message: string): void {
    const trimmed = message.trim();
    if (!trimmed) return;

    this.messages.push({ user: 'You', text: trimmed });
    this.messageHistory.push({ role: 'user', content: trimmed });

    // Send the message to the backend, which will forward it to Ollama
    this.chatService.sendMessage(this.messageHistory).subscribe({
      next: (res) => {
        const reply = res.message?.content || '[No reply]';
        this.messages.push({ user: 'Bot', text: reply });
        this.messageHistory.push({ role: 'assistant', content: reply });
      },
      error: () => {
        this.messages.push({ user: 'Bot', text: 'Error talking to bot!' });
      }
    });
  }
}
