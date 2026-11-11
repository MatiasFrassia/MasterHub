import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aventureros } from './aventureros';

describe('Aventureros', () => {
  let component: Aventureros;
  let fixture: ComponentFixture<Aventureros>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aventureros],
    }).compileComponents();

    fixture = TestBed.createComponent(Aventureros);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
