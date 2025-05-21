import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Permission } from '../models/Permission.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = environment.apiUrl + '/Permission';

  constructor(private http: HttpClient) { }

  // getAll(): Observable<Permission[]> {
  //   return this.http.get<any>(this.apiUrl).pipe(
  //     map(response => response.$values),
  //     tap(data => console.log('permissions:', data))
  //   );
  // }
  getAll(): Observable<Permission[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(response => {
        console.log('response:', response);
        
        return response.$values.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          roleNames: p.roles?.$values?.map((rp: string) => ({
            roleName: rp
          })) || []
        }));
      }),
      tap(data => console.log('permissions:', data))
    );
  }

  getById(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.apiUrl}/${id}`);
  }

  add(permission: Partial<Permission>): Observable<Permission> {
    return this.http.post<Permission>(this.apiUrl, permission);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPermissionsByRole(roleId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/by-role/${roleId}`);
  }

  roleHasPermission(roleId: number, permissionName: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/role-has-permission`, {
      params: {
        roleId,
        permissionName
      }
    });
  }

  addPermissionToRole(roleName: string, permissionName: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/add-to-role`, null, {
      params: {
        roleName,
        permissionName
      },
      responseType: 'text'
    });
  }
}
