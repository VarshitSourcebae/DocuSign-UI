import { Routes } from '@angular/router';
import { OfferPageComponent } from './offers/offer-page/offer-page';

export const routes: Routes = [
  { path: '', component: OfferPageComponent }, // default route
  { path: 'offer', component: OfferPageComponent }
];