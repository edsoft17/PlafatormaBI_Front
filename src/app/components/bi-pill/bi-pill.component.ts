import { Component, Input } from '@angular/core';

@Component({
  selector: 'bi-pill',
  standalone: true,
  imports: [],
  templateUrl: './bi-pill.component.html',
  styleUrl: './bi-pill.component.scss'
})
export class BiPillComponent {
  @Input() text!: string;
  @Input() type!: number;

  classPill!: string;

  ngOnInit(): void {
    this.classPill = this.defineClass(this.type);
  }

  defineClass(tipo: number): string {
    const map: {[key: number]: string} = {
        0: "pill-inactive",
        1: "pill-active",
    };
    return map[tipo] ?? map[0];
}
}
