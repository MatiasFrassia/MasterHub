import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaCompleta } from './tarjeta-completa';

describe('TarjetaCompleta', () => {
  let component: TarjetaCompleta;
  let fixture: ComponentFixture<TarjetaCompleta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaCompleta],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaCompleta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
