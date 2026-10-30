import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaEstado } from './tarjeta-estado';

describe('TarjetaEstado', () => {
  let component: TarjetaEstado;
  let fixture: ComponentFixture<TarjetaEstado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaEstado],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaEstado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
