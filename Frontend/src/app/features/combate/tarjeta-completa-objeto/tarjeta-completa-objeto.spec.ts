import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaCompletaObjeto } from './tarjeta-completa-objeto';

describe('TarjetaCompletaObjeto', () => {
  let component: TarjetaCompletaObjeto;
  let fixture: ComponentFixture<TarjetaCompletaObjeto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaCompletaObjeto],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaCompletaObjeto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
