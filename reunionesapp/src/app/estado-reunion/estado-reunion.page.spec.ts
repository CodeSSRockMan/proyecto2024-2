import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstadoReunionPage } from './estado-reunion.page';

describe('EstadoReunionPage', () => {
  let component: EstadoReunionPage;
  let fixture: ComponentFixture<EstadoReunionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EstadoReunionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
