import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-success',
  imports: [MatDialogModule, MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.scss'
})
export class SuccessDialogComponent {}
