import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTodos } from './ver-todos';

describe('VerTodos', () => {
  let component: VerTodos;
  let fixture: ComponentFixture<VerTodos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerTodos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerTodos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
