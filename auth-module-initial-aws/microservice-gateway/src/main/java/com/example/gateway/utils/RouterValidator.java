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
            "/api/aws/presigned-url"
    );

    // Prefijos que NO requieren autenticación
    private static final List<String> PUBLIC_PREFIXES = List.of(
            "/ws",
            "/actuator",
            "/error"
    );

    /**
     * Determina si una ruta requiere autenticación
     * @return true si requiere autenticación, false si es pública
     */
    public boolean isSecured(ServerHttpRequest request) {
        String path = request.getURI().getPath();

        System.out.println("🔍 Validando ruta: " + path);

        // 1. Verificar endpoints específicos abiertos (comparación exacta)
        boolean isOpenEndpoint = OPEN_API_ENDPOINTS.stream()
                .anyMatch(openPath -> path.equals(openPath));

        if (isOpenEndpoint) {
            System.out.println("✅ Ruta abierta (no requiere auth): " + path);
            return false; // NO requiere autenticación
        }

        // 2. Verificar prefijos públicos
        boolean isPublicPrefix = PUBLIC_PREFIXES.stream()
                .anyMatch(path::startsWith);

        if (isPublicPrefix) {
            System.out.println("✅ Prefijo público (no requiere auth): " + path);
            return false; // NO requiere autenticación
        }

        // 3. Todo lo demás requiere autenticación
        System.out.println("🔒 Ruta protegida (requiere auth): " + path);
        return true; // SÍ requiere autenticación
    }
}