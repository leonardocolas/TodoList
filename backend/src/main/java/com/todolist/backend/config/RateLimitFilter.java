package com.todolist.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final Map<String, AtomicInteger> loginAttempts = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 10;
    private static final long WINDOW_MS = 60_000; // 1 minuto

    private record AttemptInfo(int count, long windowStart) {}

    private final Map<String, AttemptInfo> attempts = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String clientIp = getClientIp(request);

        if (path.equals("/api/auth/login") && "POST".equals(request.getMethod())) {
            String key = "login:" + clientIp;
            long now = System.currentTimeMillis();

            AttemptInfo info = attempts.getOrDefault(key, new AttemptInfo(0, now));

            if (now - info.windowStart() > WINDOW_MS) {
                attempts.put(key, new AttemptInfo(1, now));
            } else if (info.count() >= MAX_ATTEMPTS) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"message\":\"Demasiados intentos. Intenta de nuevo en 1 minuto.\"}");
                return;
            } else {
                attempts.put(key, new AttemptInfo(info.count() + 1, info.windowStart()));
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
