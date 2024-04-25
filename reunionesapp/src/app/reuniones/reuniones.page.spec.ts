import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReunionesPage } from './reuniones.page';

describe('ReunionesPage', () => {
  let component: ReunionesPage;
  let fixture: ComponentFixture<ReunionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReunionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
