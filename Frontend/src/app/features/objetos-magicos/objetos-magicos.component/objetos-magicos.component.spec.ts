import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjetosMagicosComponent } from './objetos-magicos.component';

describe('ObjetosMagicosComponent', () => {
  let component: ObjetosMagicosComponent;
  let fixture: ComponentFixture<ObjetosMagicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjetosMagicosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ObjetosMagicosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
