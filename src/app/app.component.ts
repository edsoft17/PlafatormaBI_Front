import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerGlobalComponent } from '@shared/components/spinner-global/spinner-global.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,SpinnerGlobalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'PlafatormaBI_Front';
}
