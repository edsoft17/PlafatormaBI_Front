import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'bi-cont-dialog',
  standalone: true,
  imports: [MatButtonModule,MatIconModule],
  templateUrl: './bi-cont-dialog.component.html',
  styleUrl: './bi-cont-dialog.component.scss'
})
export class BiContDialogComponent {
  @Input() title: string = "";

  public dialogRef = inject(MatDialogRef<BiContDialogComponent>);

  clickclosed(): void {
    this.dialogRef.close();
  }
}
