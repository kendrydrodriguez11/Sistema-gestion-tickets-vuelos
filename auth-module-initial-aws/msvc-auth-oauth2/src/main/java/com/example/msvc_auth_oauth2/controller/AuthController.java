package com.example.msvc_auth_oauth2.controller;

import com.example.msvc_auth_oauth2.dto.RegisterDto;
import com.example.msvc_auth_oauth2.dto.TokenValidationDto;
import com.example.msvc_auth_oauth2.dto.UserDto;
import com.example.msvc_auth_oauth2.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtDecoder jwtDecoder;

    /**
     * Endpoint de registro público
     */
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@Valid @RequestBody RegisterDto registerDto) {
        log.info("Registration request for username: {}", registerDto.getUsername());
        UserDto user = userService.registerUser(registerDto);
        return ResponseEntity.ok(user);
    }

    /**
     * Endpoint de introspección de tokens (para el Gateway y otros microservicios)
     */
    @PostMapping("/introspect")
    public ResponseEntity<TokenValidationDto> introspectToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");

        if (token == null || token.isBlank()) {
            return ResponseEntity.ok(TokenValidationDto.builder()
                    .active(false)
                    .build());
        }

        try {
            Jwt jwt = jwtDecoder.decode(token);

            // Extraer información del token
            String username = jwt.getClaimAsString("sub");
            Instant expiration = jwt.getExpiresAt();
            Instant issuedAt = jwt.getIssuedAt();

            @SuppressWarnings("unchecked")
            Set<String> scopes = new HashSet<>(jwt.getClaimAsStringList("scope"));

            String clientId = jwt.getClaimAsString("client_id");

            // Verificar si el token está expirado
            boolean isActive = expiration != null && expiration.isAfter(Instant.now());

            TokenValidationDto validation = TokenValidationDto.builder()
                    .active(isActive)
                    .username(username)
                    .sub(username)
                    .scope(scopes)
                    .exp(expiration != null ? expiration.getEpochSecond() : null)
                    .iat(issuedAt != null ? issuedAt.getEpochSecond() : null)
                    .clientId(clientId)
                    .build();

            // Actualizar last login si el token es válido
            if (isActive && username != null) {
                try {
                    userService.updateLastLogin(username);
                } catch (Exception e) {
                    log.warn("Failed to update last login for user: {}", username);
                }
            }

            return ResponseEntity.ok(validation);

        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return ResponseEntity.ok(TokenValidationDto.builder()
                    .active(false)
                    .build());
        }
    }

    /**
     * Endpoint de login (redirect a OAuth2 authorization)
     */
    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> loginInfo() {
        return ResponseEntity.ok(Map.of(
                "authorization_endpoint", "http://localhost:8081/oauth2/authorize",
                "token_endpoint", "http://localhost:8081/oauth2/token",
                "message", "Use OAuth2 Authorization Code flow with PKCE"
        ));
    }
}