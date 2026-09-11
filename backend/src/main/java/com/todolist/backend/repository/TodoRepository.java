package com.todolist.backend.repository;

import com.todolist.backend.entity.Todo;
import com.todolist.backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {

    @EntityGraph(attributePaths = {"user"})
    List<Todo> findByUser(User user);

    @Transactional
    void deleteByUser(User user);
}
