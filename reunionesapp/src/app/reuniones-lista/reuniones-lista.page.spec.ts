import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReunionesListaPage } from './reuniones-lista.page';

describe('ReunionesListaPage', () => {
  let component: ReunionesListaPage;
  let fixture: ComponentFixture<ReunionesListaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReunionesListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
