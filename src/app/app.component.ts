import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatInputComponent } from './chat-input/chat-input.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ChatInputComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'patch_helper';
  handleMessage(message: string) {
    // 处理接收到的消息
    console.log('父组件接收到的消息：', message);
  }
}
