import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesObjets } from './mes-objets';

describe('MesObjets', () => {
  let component: MesObjets;
  let fixture: ComponentFixture<MesObjets>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesObjets],
    }).compileComponents();

    fixture = TestBed.createComponent(MesObjets);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
