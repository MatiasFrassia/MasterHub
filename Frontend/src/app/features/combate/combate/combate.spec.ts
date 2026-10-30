import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Combate } from './combate';

describe('Combate', () => {
  let component: Combate;
  let fixture: ComponentFixture<Combate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Combate],
    }).compileComponents();

    fixture = TestBed.createComponent(Combate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
