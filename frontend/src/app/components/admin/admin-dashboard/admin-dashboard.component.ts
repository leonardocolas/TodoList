import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
import { Todo } from '../../../models/todo.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalUsers = 0;
  totalTodos = 0;
  completedTodos = 0;
  pendingTodos = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.adminService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.totalUsers = users.length;
      }
    });

    this.adminService.getAllTodos().subscribe({
      next: (todos: Todo[]) => {
        this.totalTodos = todos.length;
        this.completedTodos = todos.filter((t: Todo) => t.completed).length;
        this.pendingTodos = todos.filter((t: Todo) => !t.completed).length;
      }
    });
  }
}
