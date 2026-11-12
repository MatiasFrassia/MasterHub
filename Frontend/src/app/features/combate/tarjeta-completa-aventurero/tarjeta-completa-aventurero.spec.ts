import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaCompletaAventurero } from './tarjeta-completa-aventurero';

describe('TarjetaCompletaAventurero', () => {
  let component: TarjetaCompletaAventurero;
  let fixture: ComponentFixture<TarjetaCompletaAventurero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaCompletaAventurero],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaCompletaAventurero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
