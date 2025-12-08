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

        log.info("🚀 Entrando a validateToken()");
        try {
            log.info("funciona");
            return webClient.post()
                    .uri("/api/auth/introspect")
                    .bodyValue(Map.of("token", token))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {
                    })
                    .doOnSuccess(r -> log.info("✅ RESPUESTA OK: {}", r))
                    .doOnError(e -> log.error("❌ ERROR: ", e))
                    .onErrorReturn(Map.of("active", false));

        } catch (Exception e) {
            log.info("error en la peticion");
            return null;
        }
    }


}
