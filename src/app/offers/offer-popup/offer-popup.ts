import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-offer-popup',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './offer-popup.html',
  styleUrls: ['./offer-popup.scss']
})
export class OfferPopup {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<OfferPopup>
  ) {}

  createEnvelope() {
    // Emit back to parent component
    this.dialogRef.close({ action: 'createEnvelope', data: this.data });
  }

  close() {
    this.dialogRef.close();
  }
}
