import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-are-usure',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './are-usure.component.html',
  styleUrl: './are-usure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreUSureComponent {
  constructor(private dialogRef: MatDialogRef<AreUSureComponent>, @Inject(MAT_DIALOG_DATA) public data: { entityName: string }) {}

  confirm() {
    this.dialogRef.close(true);
  }
}
