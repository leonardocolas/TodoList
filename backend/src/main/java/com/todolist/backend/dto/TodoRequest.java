package com.todolist.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TodoRequest {
    @NotBlank(message = "Title es requerido")
    @Size(min = 1, max = 200, message = "Title debe tener entre 1 y 200 caracteres")
    private String title;

    @Size(max = 1000, message = "Description no puede exceder 1000 caracteres")
    private String description;

    private boolean completed;
}
