package com.example.gateway.filters;

import com.example.gateway.client.AuthWebClient;
import com.example.gateway.utils.RouterValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Slf4j
@RequiredArgsConstructor
@Component
public class AuthenticationFilter implements GlobalFilter {

    private final AuthWebClient authWebClient;
    private final RouterValidator routerValidator;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        String method = request.getMethod().toString();

        log.info("Gateway Request: {} {}", method, path);

        // Verificar si es ruta pública
        if (!routerValidator.isSecured(request)) {
            log.info("Ruta pública - Sin validación de token: {}", path);
            return chain.filter(exchange);
        }

        log.info("Ruta protegida - Validando token Auth0: {}", path);

        // Obtener Authorization header
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null) {
            log.warn("Header Authorization faltante para: {}", path);
            return onError(exchange, "Token de autenticación faltante", HttpStatus.UNAUTHORIZED);
        }

        if (!authHeader.toLowerCase().startsWith("bearer ")) {
            log.warn("Token mal formado (no inicia con 'Bearer') para: {}", path);
            return onError(exchange, "Formato de token inválido", HttpStatus.UNAUTHORIZED);
        }

        // Extraer token (quitar "Bearer ")
        String token = authHeader.substring(7);
        log.debug("Validando token Auth0 para: {}", token);

        // Validar token con el servicio de autenticación
        return authWebClient.validateToken(token)
                .flatMap(response -> {
                    Boolean isActive = (Boolean) response.get("active");

                    if (Boolean.TRUE.equals(isActive)) {
                        log.info("Token Auth0 válido - Permitiendo acceso a: {}", path);

                        // Opcionalmente, agregar información del usuario al header
                        String username = (String) response.get("username");
                        if (username != null) {
                            ServerHttpRequest modifiedRequest = exchange.getRequest()
                                    .mutate()
                                    .header("X-User-Email", username)
                                    .build();
                            return chain.filter(exchange.mutate().request(modifiedRequest).build());
                        }

                        return chain.filter(exchange);
                    } else {
                        log.warn("Token Auth0 inválido o expirado para: {}", path);
                        return onError(exchange, "Token inválido o expirado", HttpStatus.UNAUTHORIZED);
                    }
                })
                .onErrorResume(e -> {
                    log.error("Error al validar token Auth0 para {}: {}", path, e.getMessage());
                    return onError(exchange, "Error en autenticación", HttpStatus.INTERNAL_SERVER_ERROR);
                });
    }

    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);

        log.error("Rechazando request: {} - Status: {}",
                exchange.getRequest().getURI().getPath(), status);

        return response.setComplete();
    }
}