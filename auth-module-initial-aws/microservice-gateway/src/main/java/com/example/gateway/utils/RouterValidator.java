package com.example.gateway.utils;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RouterValidator {

    private static final List<String> OPEN_API_ENDPOINTS = List.of(
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/introspect",
            "/api/auth/validationToken",
            "/api/aws/create",
            "/api/aws/list",
            "/api/aws/check",
            "/api/aws/presigned-url/put",
            "/api/aws/presigned-url/get",
            "/api/search/flights",
            "/.well-known/openid-configuration",
            "/oauth2/jwks"
    );

    private static final List<String> PUBLIC_PREFIXES = List.of(
            "/ws",
            "/actuator",
            "/error",
            "/oauth2/authorize",
            "/oauth2/token",
            "/login",
            "/logout"
    );

    public boolean isSecured(ServerHttpRequest request) {
        String path = request.getURI().getPath();

        boolean isOpenEndpoint = OPEN_API_ENDPOINTS.stream()
                .anyMatch(openPath -> path.equals(openPath) || path.startsWith(openPath));

        if (isOpenEndpoint) {
            return false;
        }

        boolean isPublicPrefix = PUBLIC_PREFIXES.stream()
                .anyMatch(path::startsWith);

        if (isPublicPrefix) {
            return false;
        }

        return true;
    }
}
