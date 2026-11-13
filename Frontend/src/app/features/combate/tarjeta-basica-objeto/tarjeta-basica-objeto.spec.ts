import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaBasicaObjeto } from './tarjeta-basica-objeto';

describe('TarjetaBasicaObjeto', () => {
  let component: TarjetaBasicaObjeto;
  let fixture: ComponentFixture<TarjetaBasicaObjeto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaBasicaObjeto],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaBasicaObjeto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
