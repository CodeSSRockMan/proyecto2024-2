import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReunionesAgregarParticipantePage } from './reuniones-agregar-participante.page';

describe('ReunionesAgregarParticipantePage', () => {
  let component: ReunionesAgregarParticipantePage;
  let fixture: ComponentFixture<ReunionesAgregarParticipantePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReunionesAgregarParticipantePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
