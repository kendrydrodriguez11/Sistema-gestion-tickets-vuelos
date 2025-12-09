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
            "/api/auth/validate",
            "/api/auth/google/login",
            "/api/aws/create",
            "/api/aws/list",
            "/api/aws/check",
            "/api/aws/presigned-url/put",
            "/api/aws/presigned-url/get",
            "/api/search/flights"
    );

    private static final List<String> PUBLIC_PREFIXES = List.of(
            "/login",
            "/oauth2",
            "/actuator",
            "/error"
    );

    public boolean isSecured(ServerHttpRequest request) {
        String path = request.getURI().getPath();

        // Check exact matches
        boolean isOpenEndpoint = OPEN_API_ENDPOINTS.stream()
                .anyMatch(openPath -> path.equals(openPath));


        if (isOpenEndpoint) {
            return false;
        }

        // Check prefix matches
        boolean isPublicPrefix = PUBLIC_PREFIXES.stream()
                .anyMatch(path::startsWith);

        return !isPublicPrefix;
    }
}