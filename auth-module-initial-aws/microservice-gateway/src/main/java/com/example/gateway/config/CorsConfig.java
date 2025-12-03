package com.example.gateway.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // Orígenes permitidos
        corsConfig.setAllowedOriginPatterns(List.of("*"));
        // O más específico para producción:
        // corsConfig.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001"));

        // Métodos HTTP permitidos
        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Headers permitidos
        corsConfig.setAllowedHeaders(Arrays.asList("*"));

        // Headers expuestos (para que el frontend pueda leerlos)
        corsConfig.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // Permitir credenciales (cookies, authorization headers)
        corsConfig.setAllowCredentials(true);

        // Tiempo de cache para preflight requests
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}