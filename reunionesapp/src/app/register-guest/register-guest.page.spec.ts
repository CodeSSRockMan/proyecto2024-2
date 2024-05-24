import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterGuestPage } from './register-guest.page';

describe('RegisterGuestPage', () => {
  let component: RegisterGuestPage;
  let fixture: ComponentFixture<RegisterGuestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterGuestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
