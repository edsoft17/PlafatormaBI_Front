import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from '@shared/services/spinner.service';

@Component({
  selector: 'app-spinner-global',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './spinner-global.component.html',
  styleUrl: './spinner-global.component.scss'
})
export class SpinnerGlobalComponent {
  public spinnerService = inject(SpinnerService);
}
