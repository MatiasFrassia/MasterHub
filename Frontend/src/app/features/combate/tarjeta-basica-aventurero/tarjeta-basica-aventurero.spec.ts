import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaBasicaAventurero } from './tarjeta-basica-aventurero';

describe('TarjetaBasicaAventurero', () => {
  let component: TarjetaBasicaAventurero;
  let fixture: ComponentFixture<TarjetaBasicaAventurero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaBasicaAventurero],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaBasicaAventurero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
