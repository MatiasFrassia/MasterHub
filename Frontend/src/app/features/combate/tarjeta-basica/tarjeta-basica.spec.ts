import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaBasica } from './tarjeta-basica';

describe('TarjetaBasica', () => {
  let component: TarjetaBasica;
  let fixture: ComponentFixture<TarjetaBasica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaBasica],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaBasica);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
