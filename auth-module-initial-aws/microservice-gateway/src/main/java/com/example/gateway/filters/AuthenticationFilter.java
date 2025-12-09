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

        // Rutas públicas
        if (!routerValidator.isSecured(request)) {
            log.info("Ruta pública - Sin validación: {}", path);
            return chain.filter(exchange);
        }
        log.info("Ruta protegida - Validando token: {}", path);
        // Obtener Authorization header
        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null) {
            log.warn("Authorization faltante en {}", path);
            return onError(exchange, "Token faltante", HttpStatus.UNAUTHORIZED);
        }

        if (!authHeader.toLowerCase().startsWith("bearer ")) {
            log.warn("Token mal formado en {}", path);
            return onError(exchange, "Formato de token inválido", HttpStatus.UNAUTHORIZED);
        }

        String token = authHeader.substring(7);
        log.debug("Validando token {}", token);

        // Validar token en AuthWebClient
        return authWebClient.validateToken(token)
                .flatMap(response -> {
                    Boolean isActive = (Boolean) response.get("active");
                    if (Boolean.TRUE.equals(isActive)) {
                        log.info("Token válido - Acceso permitido a {}", path);
                        String username = (String) response.get("username");

                        if (username != null) {
                            ServerHttpRequest modifiedRequest = request.mutate()
                                    .header("X-User-Email", username)
                                    .build();
                            return chain.filter(
                                    exchange.mutate().request(modifiedRequest).build()
                            );
                        }
                        return chain.filter(exchange);
                    }

                    log.warn("Token inválido o expirado en {}", path);
                    return onError(exchange, "Token inválido o expirado", HttpStatus.UNAUTHORIZED);
                })
                .onErrorResume(e -> {
                    log.error("Error validando token en {}: {}", path, e.getMessage());
                    return onError(exchange, "Error en autenticación", HttpStatus.INTERNAL_SERVER_ERROR);
                });
    }




    private Mono<Void> onError(ServerWebExchange exchange, String message, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);

        log.error("Request rechazado: {} - Status: {}",
                exchange.getRequest().getURI().getPath(),
                status
        );

        return response.setComplete();
    }
}
