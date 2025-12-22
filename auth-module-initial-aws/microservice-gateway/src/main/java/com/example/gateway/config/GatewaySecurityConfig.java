package com.example.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class GatewaySecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp
                                .policyDirectives(
                                        "default-src 'self'; " +
                                                "script-src 'self' " +
                                                "'sha256-HASH_DEL_SCRIPT_1' " +  // Hashes de tus scripts inline
                                                "'sha256-HASH_DEL_SCRIPT_2' " +
                                                "https://www.paypal.com " +
                                                "https://www.sandbox.paypal.com " +
                                                "https://www.paypalobjects.com " +
                                                "https://c.paypal.com " +
                                                "https://www.gstatic.com " +
                                                "https://www.datadoghq-browser-agent.com; " +
                                                "connect-src 'self' " +
                                                "https://www.paypal.com " +
                                                "https://api.paypal.com " +
                                                "https://api-m.paypal.com; " +
                                                "frame-src https://www.paypal.com https://www.sandbox.paypal.com; " +
                                                "img-src 'self' data: https:; " +
                                                "style-src 'self' 'unsafe-inline';"
                                )
                        )
                );
        return http.build();
    }
}
