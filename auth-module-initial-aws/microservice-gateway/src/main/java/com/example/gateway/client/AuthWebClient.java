package com.example.gateway.client;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class AuthWebClient {
    private final WebClient webClient;


    public Mono<Boolean> validateToken(String token) {
        return webClient.post()
                .uri("/validationToken")
                .bodyValue(Map.of("token", token))
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> (Boolean) response.get("isValid"));
    }
}
