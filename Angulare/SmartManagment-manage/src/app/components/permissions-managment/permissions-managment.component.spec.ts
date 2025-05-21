import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionsManagmentComponent } from './permissions-managment.component';

describe('PermissionsManagmentComponent', () => {
  let component: PermissionsManagmentComponent;
  let fixture: ComponentFixture<PermissionsManagmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionsManagmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PermissionsManagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
