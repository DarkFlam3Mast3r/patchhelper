import { Component } from '@angular/core';
import { AnswerDisplayComponent } from '../answer-display/answer-display.component';
import { QuestionInputComponent } from '../qutstion-input/qutstion-input.component';


@Component({
  selector: 'app-chat-display',
  standalone: true,
  imports: [AnswerDisplayComponent,QuestionInputComponent],
  templateUrl: './chat-display.component.html',
  styleUrl: './chat-display.component.css'
})
export class ChatDisplayComponent {
  answer: string = ''; 

  onAnswerReceived(answer: string) {
    this.answer = answer;  // 当接收到答案时，更新 answer
  }
}
