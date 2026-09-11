package com.todolist.backend.controller;

import com.todolist.backend.dto.RoleRequest;
import com.todolist.backend.dto.TodoResponse;
import com.todolist.backend.dto.UserRequest;
import com.todolist.backend.dto.UserResponse;
import com.todolist.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PostMapping("/users")
    public ResponseEntity<UserResponse> createUser(@RequestBody UserRequest request) {
        return ResponseEntity.ok(adminService.createUser(request));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserRequest request) {
        return ResponseEntity.ok(adminService.updateUser(id, request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> changeRole(@PathVariable Long id, @RequestBody RoleRequest request) {
        return ResponseEntity.ok(adminService.changeRole(id, request));
    }

    @GetMapping("/todos")
    public ResponseEntity<List<TodoResponse>> getAllTodos() {
        return ResponseEntity.ok(adminService.getAllTodos());
    }

    @GetMapping("/todos/user/{userId}")
    public ResponseEntity<List<TodoResponse>> getTodosByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getTodosByUserId(userId));
    }

    @DeleteMapping("/todos/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        adminService.deleteTodo(id);
        return ResponseEntity.ok().build();
    }
}
