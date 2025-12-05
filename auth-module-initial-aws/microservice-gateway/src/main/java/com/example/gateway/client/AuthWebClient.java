package com.example.gateway.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class AuthWebClient {

    private final WebClient webClient;

    public Mono<Map<String, Object>> validateToken(String token) {
        return webClient.post()
                .uri("/api/auth/introspect")
                .bodyValue(Map.of("token", token))
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .doOnSuccess(response -> {
                    Boolean isActive = (Boolean) response.get("active");
                    log.debug("Token validation response - active: {}", isActive);
                })
                .doOnError(error -> log.error("Error validating token: {}", error.getMessage()))
                .onErrorReturn(Map.of("active", false));
    }
}
