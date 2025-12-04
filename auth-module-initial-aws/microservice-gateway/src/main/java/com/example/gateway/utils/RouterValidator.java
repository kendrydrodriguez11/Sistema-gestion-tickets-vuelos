package com.example.gateway.utils;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RouterValidator {

    // Endpoints que NO requieren autenticación
    private static final List<String> OPEN_API_ENDPOINTS = List.of(
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/validationToken",
            "/api/aws/create",
            "/api/aws/list",
            "/api/aws/presigned-url",
            "/api/search/flights"
    );

    // Prefijos que NO requieren autenticación
    private static final List<String> PUBLIC_PREFIXES = List.of(
            "/ws",
            "/actuator",
            "/error"
    );

    public boolean isSecured(ServerHttpRequest request) {
        String path = request.getURI().getPath();

        // 1. Verificar endpoints específicos abiertos
        boolean isOpenEndpoint = OPEN_API_ENDPOINTS.stream()
                .anyMatch(openPath -> path.equals(openPath) || path.startsWith(openPath));

        if (isOpenEndpoint) {
            return false; // NO requiere autenticación
        }

        // 2. Verificar prefijos públicos
        boolean isPublicPrefix = PUBLIC_PREFIXES.stream()
                .anyMatch(path::startsWith);

        if (isPublicPrefix) {
            return false; // NO requiere autenticación
        }

        return true; // SÍ requiere autenticación
    }
}