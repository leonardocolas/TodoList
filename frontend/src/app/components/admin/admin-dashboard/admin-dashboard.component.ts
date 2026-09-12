import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { User } from '../../../models/user.model';
import { Todo } from '../../../models/todo.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  totalUsers = 0;
  totalTodos = 0;
  completedTodos = 0;
  pendingTodos = 0;
  private subs: Subscription[] = [];

  constructor(
    private adminService: AdminService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  loadStats(): void {
    this.subs.push(
      this.adminService.getAllUsers().subscribe({
        next: (users: User[]) => {
          this.totalUsers = users.length;
          this.changeDetector.detectChanges();
        },
        error: () => this.changeDetector.detectChanges()
      })
    );

    this.subs.push(
      this.adminService.getAllTodos().subscribe({
        next: (todos: Todo[]) => {
          this.totalTodos = todos.length;
          this.completedTodos = todos.filter((t: Todo) => t.completed).length;
          this.pendingTodos = todos.filter((t: Todo) => !t.completed).length;
          this.changeDetector.detectChanges();
        },
        error: () => this.changeDetector.detectChanges()
      })
    );
  }
}
