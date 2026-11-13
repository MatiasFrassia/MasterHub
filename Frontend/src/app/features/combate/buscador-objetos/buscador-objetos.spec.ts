import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorObjetos } from './buscador-objetos';

describe('BuscadorObjetos', () => {
  let component: BuscadorObjetos;
  let fixture: ComponentFixture<BuscadorObjetos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorObjetos],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorObjetos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
