import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaConjuro } from './tarjeta-conjuro';

describe('TarjetaConjuro', () => {
  let component: TarjetaConjuro;
  let fixture: ComponentFixture<TarjetaConjuro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaConjuro],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetaConjuro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
