import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorAventureros } from './buscador-aventureros';

describe('BuscadorAventureros', () => {
  let component: BuscadorAventureros;
  let fixture: ComponentFixture<BuscadorAventureros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorAventureros],
    }).compileComponents();

    fixture = TestBed.createComponent(BuscadorAventureros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
