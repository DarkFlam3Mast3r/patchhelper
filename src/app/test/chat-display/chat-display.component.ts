import { Component } from '@angular/core';
import { AnswerDisplayComponent } from '../answer-display/answer-display.component';
import { QuestionInputComponent } from '../qutstion-input/qutstion-input.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-display',
  standalone: true,
  imports: [AnswerDisplayComponent, QuestionInputComponent,CommonModule],
  templateUrl: './chat-display.component.html',
  styleUrl: './chat-display.component.css',
})
export class ChatDisplayComponent {
  questionsAndAnswers: { question: string; answer: string }[] = []; // 存储问题和答案

  onAnswerReceived(event: { question: string; answer: string }) {
    console.log('Received:', event);
    this.questionsAndAnswers.push(event); // 将新的问题和答案添加到数组
    console.log(this.questionsAndAnswers)
  }
}
