import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarParticipanteManualPage } from './agregar-participante-manual.page';

describe('AgregarParticipanteManualPage', () => {
  let component: AgregarParticipanteManualPage;
  let fixture: ComponentFixture<AgregarParticipanteManualPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarParticipanteManualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
