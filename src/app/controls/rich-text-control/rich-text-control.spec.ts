import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RichTextControl } from './rich-text-control';

describe('RichTextControl', () => {
  let component: RichTextControl;
  let fixture: ComponentFixture<RichTextControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RichTextControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RichTextControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
