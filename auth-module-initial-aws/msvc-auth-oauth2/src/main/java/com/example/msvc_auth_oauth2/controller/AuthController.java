package com.example.msvc_auth_oauth2.controller;

import com.example.msvc_auth_oauth2.dto.TokenValidationDto;
import com.example.msvc_auth_oauth2.dto.UserDto;
import com.example.msvc_auth_oauth2.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;

import java.time.Instant;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtDecoder jwtDecoder;
    private final RestTemplate restTemplate;

    @Value("${auth0.domain}")
    private String auth0Domain;

    /**
     * Endpoint de introspección de tokens Auth0
     */
    @PostMapping("/introspect")
    public ResponseEntity<TokenValidationDto> introspectToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        log.info("=== Token Introspection Request ===");

        if (token == null || token.isBlank()) {
            log.warn("❌ Token vacío o nulo");
            return ResponseEntity.ok(TokenValidationDto.builder()
                    .active(false)
                    .build());
        }

        try {
            Jwt jwt = jwtDecoder.decode(token);
            log.info("✅ Token decodificado exitosamente");

            return ResponseEntity.ok(buildValidationFromJwt(jwt));

        } catch (JwtException e) {
            log.error("❌ Error decodificando token JWT: {}", e.getMessage());
            return ResponseEntity.ok(TokenValidationDto.builder()
                    .active(false)
                    .build());
        }
    }

    private TokenValidationDto buildValidationFromJwt(Jwt jwt) {
        String username = jwt.getSubject();
        String email = jwt.getClaim("email");
        Instant expiration = jwt.getExpiresAt();
        Instant issuedAt = jwt.getIssuedAt();

        Set<String> scopes = new HashSet<>();
        Object scopeClaim = jwt.getClaim("scope");
        if (scopeClaim instanceof String) {
            scopes.addAll(Arrays.asList(((String) scopeClaim).split(" ")));
        }

        String clientId = jwt.getClaim("azp");
        boolean isActive = expiration != null && expiration.isAfter(Instant.now());

        if (isActive && email != null) {
            try {
                userService.updateLastLoginByEmail(email);
            } catch (Exception e) {
                log.warn("⚠️ Failed to update last login for email: {}", email);
            }
        }

        return TokenValidationDto.builder()
                .active(isActive)
                .username(email != null ? email : username)
                .sub(username)
                .scope(scopes)
                .exp(expiration != null ? expiration.getEpochSecond() : null)
                .iat(issuedAt != null ? issuedAt.getEpochSecond() : null)
                .clientId(clientId)
                .build();
    }

    /**
     * Validar token JWT
     */
    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String authHeader) {
        log.info("=== Token Validation Request ===");

        try {
            String token = authHeader.replace("Bearer ", "");
            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getClaim("email");

            log.info("✅ Token válido");
            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "email", email != null ? email : jwt.getSubject()
            ));
        } catch (Exception e) {
            log.error("❌ Token validation error: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }

    /**
     * Obtener información del usuario desde Auth0 UserInfo endpoint
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        log.info("=== Get Current User Request ===");

        try {
            String token = authHeader.replace("Bearer ", "");

            // Decodificar el token para verificar que sea válido
            Jwt jwt = jwtDecoder.decode(token);
            log.info("✅ JWT decodificado - Sub: {}", jwt.getSubject());

            // Llamar al endpoint /userinfo de Auth0 para obtener email y name
            String userInfoUrl = "https://" + auth0Domain + "/userinfo";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            log.info("🔍 Llamando a Auth0 UserInfo: {}", userInfoUrl);

            ResponseEntity<Map> response = restTemplate.exchange(
                    userInfoUrl,
                    HttpMethod.GET,
                    entity,
                    Map.class
            );

            Map<String, Object> userInfo = response.getBody();
            log.info("✅ UserInfo obtenido: {}", userInfo);

            // Extraer información del usuario
            String email = (String) userInfo.get("email");
            String name = (String) userInfo.get("name");
            String picture = (String) userInfo.get("picture");

            if (email == null || email.isEmpty()) {
                log.error("❌ No se pudo extraer email del UserInfo");
                throw new RuntimeException("Unable to extract email from Auth0 UserInfo");
            }

            log.info("📧 Email extraído: {}", email);

            // Buscar o crear usuario en la base de datos
            try {
                log.info("🔍 Buscando usuario por email: {}", email);
                UserDto user = userService.getUserByEmail(email);
                log.info("✅ Usuario encontrado en DB: {}", user.getUsername());

                return ResponseEntity.ok(Map.of(
                        "user", user,
                        "authenticated", true
                ));

            } catch (Exception e) {
                log.info("⚠️ Usuario no encontrado, creando nuevo usuario: {}", email);

                try {
                    UserDto newUser = userService.createUserFromAuth0(email, name, picture);
                    log.info("✅ Nuevo usuario creado: {}", newUser.getUsername());

                    return ResponseEntity.ok(Map.of(
                            "user", newUser,
                            "authenticated", true
                    ));
                } catch (Exception createError) {
                    log.error("❌ Error creando usuario: {}", createError.getMessage());
                    throw createError;
                }
            }

        } catch (JwtException e) {
            log.error("❌ JWT Error: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of(
                    "authenticated", false,
                    "error", "Invalid or expired token",
                    "details", e.getMessage()
            ));
        } catch (Exception e) {
            log.error("❌ Error getting current user: {}", e.getMessage(), e);
            return ResponseEntity.status(401).body(Map.of(
                    "authenticated", false,
                    "error", "Failed to retrieve user information",
                    "details", e.getMessage()
            ));
        }
    }
}