import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RecaptchaModule, ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'ui-captcha',
  standalone: true,
  imports: [RecaptchaModule],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss'
})
export class CaptchaComponent {
  @Output() eventGetToken: EventEmitter<string> = new EventEmitter<string>();

  executeRecaptchaVisible(token: any): void {
    this.eventGetToken.emit(token);
  }
}
