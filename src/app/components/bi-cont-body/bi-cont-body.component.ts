import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-bi-cont-body',
  standalone: true,
  imports: [],
  templateUrl: './bi-cont-body.component.html',
  styleUrl: './bi-cont-body.component.scss'
})
export class BiContBodyComponent {
  @Input() title!: string;
}
