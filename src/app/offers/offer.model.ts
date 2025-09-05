export interface Offer {
  id: string;
  recipientName: string;
  recipientEmail: string;
  content: string;
  pdfUrl?: string;
  status: OfferEnvelopeStatus;
}

export type OfferEnvelopeStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'completed';
