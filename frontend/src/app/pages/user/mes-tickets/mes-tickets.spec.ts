import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesTickets } from './mes-tickets';

describe('MesTickets', () => {
  let component: MesTickets;
  let fixture: ComponentFixture<MesTickets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesTickets],
    }).compileComponents();

    fixture = TestBed.createComponent(MesTickets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
