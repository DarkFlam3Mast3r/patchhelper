import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

const SERVERURL = environment.apiUrl + '/ask-python';
@Component({
  selector: 'app-qutstion-input',
  templateUrl: './qutstion-input.component.html',
  styleUrls: ['./qutstion-input.component.css'],
  standalone: true,
  imports: [
    HttpClientModule,
    MatSnackBarModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    CommonModule,
  ],
})
export class QuestionInputComponent {
  question: string = '';
  isLoading = false;

  @Output() answerReceived = new EventEmitter<{
    question: string;
    answer: string;
  }>();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  submitQuestion() {
    if (this.question.trim()) {
      const currentQuestion = this.question;
      this.isLoading = true;
      this.http
        .post<{ answer: string }>('http://localhost:3000/ask-python', {
          question: this.question,
        })
        .subscribe(
          (response) => {
            this.snackBar.open('Answer received!', 'Close', { duration: 2000 });
            console.log('Server response:', response);
            this.answerReceived.emit({
              question: currentQuestion,
              answer: response.answer,
            });
            this.isLoading = false;
            // setTimeout(() => {
            //   console.log('服务器返回:', response);
            //   this.isLoading = false; 
            // }, 5000); 
          },
          (error) => {
            this.snackBar.open('Error fetching answer!', 'Close', {
              duration: 2000,
            });
            this.isLoading = false;
          }
        );
    } else {
      this.snackBar.open('Please enter a question!', 'Close', {
        duration: 2000,
      });
    }
  }
}
