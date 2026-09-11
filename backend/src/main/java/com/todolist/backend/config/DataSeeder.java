package com.todolist.backend.config;

import com.todolist.backend.entity.Role;
import com.todolist.backend.entity.User;
import com.todolist.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@todolist.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created: admin / admin123");
        }

        if (!userRepository.existsByUsername("super")) {
            User superUser = User.builder()
                    .username("super")
                    .email("super@todolist.com")
                    .password(passwordEncoder.encode("super123"))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(superUser);
            log.info("Super user created: super / super123");
        }
    }
}
