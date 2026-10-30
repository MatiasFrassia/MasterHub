import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorCriaturas } from './buscador-criaturas';

describe('BuscadorCriaturas', () => {
  let component: BuscadorCriaturas;
  let fixture: ComponentFixture<BuscadorCriaturas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorCriaturas],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorCriaturas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
