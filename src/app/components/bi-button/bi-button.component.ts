import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonType } from '@shared/enums/button-type.enum';

@Component({
  selector: 'bi-button',
  standalone: true,
  imports: [MatButtonModule,NgClass],
  templateUrl: './bi-button.component.html',
  styleUrl: './bi-button.component.scss'
})
export class BiButtonComponent {
  @Input() disabledButton: boolean = false;
  @Input() typeBI!: number;
  @Input() text: string = "";

  @Output() eventAction: EventEmitter<void> = new EventEmitter<void>();

  buttonType = ButtonType;

  actionClick(): void {
    this.eventAction.emit();
  }
}
