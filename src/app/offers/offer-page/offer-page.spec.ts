import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPage } from './offer-page';

describe('OfferPage', () => {
  let component: OfferPage;
  let fixture: ComponentFixture<OfferPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
