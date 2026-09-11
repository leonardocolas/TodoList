package com.todolist.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank(message = "Username es requerido")
    @Size(min = 3, max = 50, message = "Username debe tener entre 3 y 50 caracteres")
    private String username;

    @NotBlank(message = "Email es requerido")
    @Email(message = "Email debe ser valido")
    private String email;

    @Size(min = 6, max = 100, message = "Password debe tener entre 6 y 100 caracteres")
    private String password;

    private String role;
    private Boolean enabled = true;
}
