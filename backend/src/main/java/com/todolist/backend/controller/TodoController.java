package com.todolist.backend.controller;

import com.todolist.backend.dto.TodoRequest;
import com.todolist.backend.dto.TodoResponse;
import com.todolist.backend.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {
    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoResponse>> getTodos(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok(todoService.getUserTodos(username));
    }

    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(
            Authentication authentication,
            @Valid @RequestBody TodoRequest request) {
        String username = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED).body(todoService.createTodo(username, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(
            @PathVariable Long id,
            Authentication authentication,
            @Valid @RequestBody TodoRequest request) {
        String username = authentication.getName();
        return ResponseEntity.ok(todoService.updateTodo(id, username, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        todoService.deleteTodo(id, username);
        return ResponseEntity.noContent().build();
    }
}
