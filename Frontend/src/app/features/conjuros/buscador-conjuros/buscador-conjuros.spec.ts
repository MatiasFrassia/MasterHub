import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorConjuros } from './buscador-conjuros';

describe('BuscadorConjuros', () => {
  let component: BuscadorConjuros;
  let fixture: ComponentFixture<BuscadorConjuros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorConjuros],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorConjuros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
