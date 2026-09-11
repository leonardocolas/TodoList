import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: false,
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  showForm = false;
  editingUser: User | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private adminService: AdminService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['USER', [Validators.required]],
      enabled: [true]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar usuarios';
      }
    });
  }

  openForm(user?: User): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (user) {
      this.editingUser = user;
      this.userForm.patchValue({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
        enabled: user.enabled
      });
      this.userForm.get('password')?.clearValidators();
    } else {
      this.editingUser = null;
      this.userForm.reset({ role: 'USER', enabled: true });
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.userForm.get('password')?.updateValueAndValidity();
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingUser = null;
    this.userForm.reset();
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const userData: any = { ...this.userForm.value };

      if (this.editingUser && (!userData.password || userData.password === '')) {
        delete userData.password;
      }

      if (this.editingUser?.id) {
        this.adminService.updateUser(this.editingUser.id, userData).subscribe({
          next: () => {
            this.successMessage = 'Usuario actualizado correctamente';
            this.loadUsers();
            this.closeForm();
          },
          error: (err: any) => {
            this.errorMessage = err.error?.message || 'Error al actualizar usuario';
          }
        });
      } else {
        this.adminService.createUser(userData).subscribe({
          next: () => {
            this.successMessage = 'Usuario creado correctamente';
            this.loadUsers();
            this.closeForm();
          },
          error: (err: any) => {
            this.errorMessage = err.error?.message || 'Error al crear usuario';
          }
        });
      }
    }
  }

  toggleRole(user: User): void {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    if (confirm(`¿Cambiar el rol de ${user.username} a ${newRole}?`)) {
      this.adminService.changeRole(user.id!, newRole).subscribe({
        next: () => {
          this.successMessage = `Rol cambiado a ${newRole}`;
          this.loadUsers();
        },
        error: (err: any) => {
          this.errorMessage = 'Error al cambiar rol';
        }
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.username}? Se eliminarán todas sus tareas.`)) {
      this.adminService.deleteUser(user.id!).subscribe({
        next: () => {
          this.successMessage = 'Usuario eliminado correctamente';
          this.loadUsers();
        },
        error: (err: any) => {
          this.errorMessage = 'Error al eliminar usuario';
        }
      });
    }
  }
}
