import { Component, OnInit } from '@angular/core';
import { Permission } from '../../models/Permission.model';
import { PermissionService } from '../../services/permissions.service';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-permissions-managment',
  imports: [CommonModule, FormsModule],
  templateUrl: './permissions-managment.component.html',
  styleUrl: './permissions-managment.component.scss'
})
export class PermissionsManagmentComponent implements OnInit {
  permission$: Observable<Permission[]>;
  newPermission = { name: '', description: '' };
  roleName = '';
  permissionName = '';
  copiedIndex: number | null = null;
  customRoleName: string = '';
  
  constructor(private permissionService: PermissionService) { }
  
  ngOnInit(): void {
    this.loadPermissions();
  }
  
  loadPermissions() {
    this.permission$ = this.permissionService.getAll();
  }
  
  addPermission() {
    if (!this.newPermission.name) return;
    this.permissionService.add(this.newPermission).subscribe(() => {
      this.newPermission = { name: '', description: '' };
      this.loadPermissions();
    });
  }
  
  deletePermission(id: number) {
    this.permissionService.delete(id).subscribe(() => {
      this.loadPermissions();
    });
  }
  
  assignPermissionToRole() {
    const finalRoleName = this.roleName === 'custom' ? this.customRoleName : this.roleName;
    if (!finalRoleName || !this.permissionName) return;
    
    this.permissionService.addPermissionToRole(finalRoleName, this.permissionName).subscribe(() => {
      alert('Permission assigned successfully');
    });
  }
  
  selectPermission(permissionName: string) {
    this.permissionName = permissionName;
  }
}