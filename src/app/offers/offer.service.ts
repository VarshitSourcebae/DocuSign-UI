import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Offer, OfferEnvelopeStatus } from './offer.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OfferService {
  private offers: Offer[] = [];
  private statusSubject = new BehaviorSubject<{ [id: string]: OfferEnvelopeStatus }>({});

  constructor(private http: HttpClient) { }
  createJobOffer(recipientName: string, recipientEmail: string, offerContent: string): Observable<any> {
    const body = {
      recipientName,
      recipientEmail,
      offerContent
    };
    return this.http.post('https://localhost:7053/api/JobOffer', body);
  }
  createEnvelope(offerId: number) {
    return this.http.post(`https://localhost:7053/api/JobOffer/send/${offerId}`, {});
  }
  getOfferPdf(offerId: number) {
    debugger
    return this.http.get(`https://localhost:7053/api/JobOffer/${offerId}/pdf`, {
      responseType: 'blob'
    });
  }


  // send for signature (simulate DocuSign)
  sendForSignature(id: string): Observable<OfferEnvelopeStatus> {
    this.statusSubject.next({ ...this.statusSubject.value, [id]: 'sent' });

    // simulate async signing process
    setTimeout(() => {
      this.statusSubject.next({ ...this.statusSubject.value, [id]: 'viewed' });
    }, 2000);

    setTimeout(() => {
      this.statusSubject.next({ ...this.statusSubject.value, [id]: 'signed' });
    }, 5000);

    setTimeout(() => {
      this.statusSubject.next({ ...this.statusSubject.value, [id]: 'completed' });
    }, 8000);

    return of<'sent'>('sent').pipe(delay(500));
  }

  // get status updates
  getStatus(id: string): Observable<OfferEnvelopeStatus> {
    return new Observable<OfferEnvelopeStatus>(observer => {
      const sub = this.statusSubject.subscribe(statuses => {
        if (statuses[id]) {
          observer.next(statuses[id]);
        }
      });

      return () => sub.unsubscribe();
    });
  }
}
