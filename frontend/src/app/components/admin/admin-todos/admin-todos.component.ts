import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
import { Todo } from '../../../models/todo.model';

@Component({
  selector: 'app-admin-todos',
  standalone: false,
  templateUrl: './admin-todos.component.html',
  styleUrls: ['./admin-todos.component.css']
})
export class AdminTodosComponent implements OnInit {
  todos: Todo[] = [];
  users: User[] = [];
  selectedUserId: number | null = null;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadAllTodos();
  }

  loadUsers(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users: User[]) => this.users = users
    });
  }

  loadAllTodos(): void {
    this.isLoading = true;
    this.adminService.getAllTodos().subscribe({
      next: (todos: Todo[]) => {
        this.todos = todos;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar las tareas';
      }
    });
  }

  filterByUser(userId: number | null): void {
    this.selectedUserId = userId;
    if (userId === null) {
      this.loadAllTodos();
    } else {
      this.isLoading = true;
      this.adminService.getTodosByUserId(userId).subscribe({
        next: (todos: Todo[]) => {
          this.todos = todos;
          this.isLoading = false;
        },
        error: (err: any) => {
          this.isLoading = false;
          this.errorMessage = 'Error al cargar las tareas del usuario';
        }
      });
    }
  }

  deleteTodo(todo: Todo): void {
    if (confirm(`¿Eliminar la tarea "${todo.title}"?`)) {
      this.adminService.deleteTodo(todo.id!).subscribe({
        next: () => {
          this.successMessage = 'Tarea eliminada correctamente';
          if (this.selectedUserId !== null) {
            this.filterByUser(this.selectedUserId);
          } else {
            this.loadAllTodos();
          }
        },
        error: (err: any) => {
          this.errorMessage = 'Error al eliminar la tarea';
        }
      });
    }
  }
}
