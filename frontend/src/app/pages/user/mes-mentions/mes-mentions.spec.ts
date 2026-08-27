import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesMentions } from './mes-mentions';

describe('MesMentions', () => {
  let component: MesMentions;
  let fixture: ComponentFixture<MesMentions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesMentions],
    }).compileComponents();

    fixture = TestBed.createComponent(MesMentions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
