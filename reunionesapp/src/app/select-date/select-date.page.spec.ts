import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectDatePage } from './select-date.page';

describe('SelectDatePage', () => {
  let component: SelectDatePage;
  let fixture: ComponentFixture<SelectDatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
