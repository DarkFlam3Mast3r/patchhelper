import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

import { marked } from 'marked';

@Component({
  selector: 'app-answer-display',
  standalone: true,
  imports: [MatCardModule,CommonModule],
  templateUrl: './answer-display.component.html',
  styleUrl: './answer-display.component.css'
})
export class AnswerDisplayComponent implements OnChanges {
  @Input() question: string = ''; // 接收问题
  @Input() answer: string = ''; // 接收答案
  parsedAnswer: string = '';

  async ngOnChanges() {
    if (this.answer) {
      this.parsedAnswer =await marked(this.answer); // 将 Markdown 转为 HTML
    }
  }
}