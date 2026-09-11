package com.todolist.backend.service;

import com.todolist.backend.dto.TodoRequest;
import com.todolist.backend.dto.TodoResponse;
import com.todolist.backend.entity.Todo;
import com.todolist.backend.entity.User;
import com.todolist.backend.exception.ResourceNotFoundException;
import com.todolist.backend.repository.TodoRepository;
import com.todolist.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<TodoResponse> getUserTodos(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        return todoRepository.findByUser(user)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public TodoResponse createTodo(String username, TodoRequest request) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Todo todo = Todo.builder()
            .title(request.getTitle())
            .description(request.getDescription())
            .completed(false)
            .user(user)
            .build();

        todo = todoRepository.save(todo);
        return mapToResponse(todo);
    }

    @Transactional
    public TodoResponse updateTodo(Long id, String username, TodoRequest request) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Todo no encontrado"));

        if (!todo.getUser().getUsername().equals(username)) {
            throw new ResourceNotFoundException("Todo no encontrado");
        }

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(request.isCompleted());

        todo = todoRepository.save(todo);
        return mapToResponse(todo);
    }

    @Transactional
    public void deleteTodo(Long id, String username) {
        Todo todo = todoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Todo no encontrado"));

        if (!todo.getUser().getUsername().equals(username)) {
            throw new ResourceNotFoundException("Todo no encontrado");
        }

        todoRepository.delete(todo);
    }

    private TodoResponse mapToResponse(Todo todo) {
        return TodoResponse.builder()
            .id(todo.getId())
            .title(todo.getTitle())
            .description(todo.getDescription())
            .completed(todo.isCompleted())
            .createdAt(todo.getCreatedAt())
            .userId(todo.getUser().getId())
            .username(todo.getUser().getUsername())
            .build();
    }
}
