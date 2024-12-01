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
  @Input() answer: string = '';  // 从父组件接收到的答案
  parsedAnswer: string = '';     // 转换后的 HTML 格式答案

  async ngOnChanges() {
    if (this.answer) {
      this.parsedAnswer =await marked(this.answer); // 将 Markdown 转为 HTML
    }
  }
}