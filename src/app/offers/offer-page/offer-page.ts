import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RichTextControl } from "../../controls/rich-text-control/rich-text-control";
import { Header } from "../../core/header/header";
import { OfferService } from '../offer.service';
import { Offer, OfferEnvelopeStatus } from '../offer.model';
import { CommonModule } from '@angular/common';
import { jsPDF } from "jspdf";
import { MatDialog } from '@angular/material/dialog';
import { OfferPopup } from '../offer-popup/offer-popup';
import { SafeUrlPipe } from "../../shared/safe-url-pipe";

@Component({
  selector: 'app-offer-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RichTextControl,
    Header,
    CommonModule,
    SafeUrlPipe
],
  templateUrl: './offer-page.html',
  styleUrls: ['./offer-page.scss']
})
export class OfferPageComponent {
  form: FormGroup;
  generatedOffer: Offer | null = null;
  status: OfferEnvelopeStatus | null = null;
  generatedPdfBlob: Blob | null = null;
  pdfUrl: string | null = null;
  id: number = 0;

  constructor(private fb: FormBuilder, private offerService: OfferService, private dialog: MatDialog) {
    this.form = this.fb.group({
      recipientName: ['', Validators.required],
      recipientEmail: ['', [Validators.required, Validators.email]],
      content: ['', Validators.required]
    });
  }

  // Generate offer record in backend
  generateOffer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { recipientName, recipientEmail, content } = this.form.value;

    this.offerService.createJobOffer(recipientName, recipientEmail, content)
      .subscribe({
        next: (response) => {
          console.log('API response:', response);

          debugger
          this.offerService.getOfferPdf(response.id).subscribe((pdfBlob: Blob) => {
            this.generatedPdfBlob = pdfBlob;
          const url = URL.createObjectURL(pdfBlob);
          this.pdfUrl = url;   // set for iframe preview
          debugger
          this.id = response.id;
        });


          // Open popup and pass API response
          const dialogRef = this.dialog.open(OfferPopup, {
            width: '400px',
            data: response
          });

          // Handle popup close
          dialogRef.afterClosed().subscribe((result: { action: string; data: any } | undefined) => {

          });
        },
        error: (err) => {
          console.error('API error:', err);
        }
      });
  }
  

  generatePdf(name: string, email: string, content: string) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Job Offer Letter', 10, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 10, 35);
    doc.text(`Email: ${email}`, 10, 45);

    doc.setFont('', 'bold');
    doc.text('Offer Content:', 10, 60);
    doc.setFont('', 'normal');

    // For simplicity, strip HTML tags from content
    const plainContent = content.replace(/<[^>]+>/g, '');
    doc.text(plainContent, 10, 70);

    // Save blob for preview
    this.generatedPdfBlob = doc.output('blob');
  }

  // Preview PDF in browser
  previewPdf() {
    if (!this.generatedPdfBlob) return;
    const url = URL.createObjectURL(this.generatedPdfBlob);
    window.open(url, '_blank');
  }
  

  // Send offer for signature (using your OfferService)
  sendForSignature() {
    debugger
      this.offerService.createEnvelope(this.id).subscribe(envRes => {
                console.log('Envelope created:', envRes);

              });
  }
}
