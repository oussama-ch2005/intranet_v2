import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Objets } from './objets';

describe('Objets', () => {
  let component: Objets;
  let fixture: ComponentFixture<Objets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Objets],
    }).compileComponents();

    fixture = TestBed.createComponent(Objets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
