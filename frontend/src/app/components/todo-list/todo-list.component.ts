import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: false,
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  todoForm: FormGroup;
  editingTodo: Todo | null = null;
  showForm = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private todoService: TodoService,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', []]
    });
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.isLoading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar las tareas';
        this.changeDetector.detectChanges();
      }
    });
  }

  openForm(todo?: Todo): void {
    this.errorMessage = '';
    if (todo) {
      this.editingTodo = todo;
      this.todoForm.patchValue({
        title: todo.title,
        description: todo.description
      });
    } else {
      this.editingTodo = null;
      this.todoForm.reset();
    }
    this.showForm = true;
    this.changeDetector.detectChanges();
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTodo = null;
    this.todoForm.reset();
    this.errorMessage = '';
    this.changeDetector.detectChanges();
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const todoData: Todo = {
        title: this.todoForm.get('title')?.value,
        description: this.todoForm.get('description')?.value,
        completed: false
      };

      if (this.editingTodo?.id) {
        todoData.completed = this.editingTodo.completed;
        this.todoService.updateTodo(this.editingTodo.id, todoData).subscribe({
          next: () => {
            this.loadTodos();
            this.closeForm();
            this.changeDetector.detectChanges();
          },
          error: () => {
            this.errorMessage = 'Error al actualizar la tarea';
            this.changeDetector.detectChanges();
          }
        });
      } else {
        this.todoService.createTodo(todoData).subscribe({
          next: () => {
            this.loadTodos();
            this.closeForm();
            this.changeDetector.detectChanges();
          },
          error: () => {
            this.errorMessage = 'Error al crear la tarea';
            this.changeDetector.detectChanges();
          }
        });
      }
    }
  }

  toggleCompleted(todo: Todo): void {
    if (!todo.id) return;
    const updated: Todo = {
      ...todo,
      completed: !todo.completed
    };
    this.todoService.updateTodo(todo.id, updated).subscribe({
      next: () => {
        this.loadTodos();
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Error al actualizar la tarea';
        this.changeDetector.detectChanges();
      }
    });
  }

  deleteTodo(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.errorMessage = '';
      this.todoService.deleteTodo(id).subscribe({
        next: () => this.loadTodos(),
        error: () => {
          this.errorMessage = 'Error al eliminar la tarea';
          this.changeDetector.detectChanges();
        }
      });
    }
  }
}
