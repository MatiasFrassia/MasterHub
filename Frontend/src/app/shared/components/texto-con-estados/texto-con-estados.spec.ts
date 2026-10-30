import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoConEstados } from './texto-con-estados';

describe('TextoConEstados', () => {
  let component: TextoConEstados;
  let fixture: ComponentFixture<TextoConEstados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextoConEstados],
    }).compileComponents();

    fixture = TestBed.createComponent(TextoConEstados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
