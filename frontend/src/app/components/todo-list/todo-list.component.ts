import { Component, OnInit } from '@angular/core';
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

  constructor(private todoService: TodoService, private fb: FormBuilder) {
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
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error al cargar las tareas';
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
  }

  closeForm(): void {
    this.showForm = false;
    this.editingTodo = null;
    this.todoForm.reset();
    this.errorMessage = '';
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
          },
          error: () => {
            this.errorMessage = 'Error al actualizar la tarea';
          }
        });
      } else {
        this.todoService.createTodo(todoData).subscribe({
          next: () => {
            this.loadTodos();
            this.closeForm();
          },
          error: () => {
            this.errorMessage = 'Error al crear la tarea';
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
      next: () => this.loadTodos(),
      error: () => {
        this.errorMessage = 'Error al actualizar la tarea';
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
        }
      });
    }
  }
}
