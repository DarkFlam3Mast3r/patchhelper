import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.css'
})
export class ChatInputComponent {
  message: string = '';
  @ViewChild('textArea') textArea!: ElementRef;

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  autoGrow(event: Event) {
    const textArea = this.textArea.nativeElement;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }

  sendMessage() {
    if (this.message.trim()) {
      // 在这里处理发送消息的逻辑，例如通过 EventEmitter 向父组件发送消息
      console.log('发送的消息：', this.message.trim());
      this.message = '';
      this.resetTextAreaHeight();
    }
  }

  resetTextAreaHeight() {
    const textArea = this.textArea.nativeElement;
    textArea.style.height = 'auto';
  }
}