import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
  ],
})
export class QuestionInputComponent {
  question: string = '';
  @Output() answerReceived = new EventEmitter<{ question: string; answer: string }>();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  submitQuestion() {
    if (this.question.trim()) {
      const currentQuestion = this.question;
      this.http
        .post<{ answer: string }>('http://localhost:3000/ask-python', {
          question: this.question,
        })
        .subscribe(
          (response) => {
            this.snackBar.open('Answer received!', 'Close', { duration: 2000 });
            console.log('Server response:', response);
            this.answerReceived.emit({ question: currentQuestion, answer: response.answer });
          
          },
          (error) => {
            this.snackBar.open('Error fetching answer!', 'Close', {
              duration: 2000,
            });
          }
        );
    } else {
      this.snackBar.open('Please enter a question!', 'Close', {
        duration: 2000,
      });
    }
  }
}
