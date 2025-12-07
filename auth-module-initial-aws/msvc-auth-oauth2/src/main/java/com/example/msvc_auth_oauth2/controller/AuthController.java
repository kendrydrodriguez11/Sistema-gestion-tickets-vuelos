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
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtDecoder jwtDecoder;

    @Value("${auth0.domain}")
    private String auth0Domain;

    /**
     * Endpoint de introspección de tokens Auth0
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
            log.info("🔍 Intentando decodificar token...");
            Jwt jwt = jwtDecoder.decode(token);

            log.info("✅ Token decodificado exitosamente");
            log.info("   - Subject: {}", jwt.getSubject());
            log.info("   - Issuer: {}", jwt.getIssuer());
            log.info("   - Audience: {}", jwt.getAudience());
            log.info("   - Expires: {}", jwt.getExpiresAt());

            return ResponseEntity.ok(buildValidationFromJwt(jwt));

        } catch (Exception e) {
            log.error("❌ Token validation failed: {}", e.getMessage());
            log.error("   - Token (primeros 20 chars): {}", token.substring(0, Math.min(20, token.length())));
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

        // Extraer scopes
        Set<String> scopes = new HashSet<>();
        try {
            Object scopeClaim = jwt.getClaim("scope");
            if (scopeClaim != null) {
                if (scopeClaim instanceof String) {
                    scopes.addAll(Arrays.asList(((String) scopeClaim).split(" ")));
                } else if (scopeClaim instanceof Collection) {
                    @SuppressWarnings("unchecked")
                    Collection<String> scopeCollection = (Collection<String>) scopeClaim;
                    scopes.addAll(scopeCollection);
                }
            }
        } catch (Exception e) {
            log.warn("Error extracting scopes from JWT: {}", e.getMessage());
        }

        String clientId = jwt.getClaim("client_id");
        boolean isActive = expiration != null && expiration.isAfter(Instant.now());

        // Actualizar last login si el token es válido
        if (isActive && email != null) {
            try {
                userService.updateLastLoginByEmail(email);
            } catch (Exception e) {
                log.warn("Failed to update last login for email: {}", email);
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
        try {
            String token = authHeader.replace("Bearer ", "");
            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getClaim("email");

            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "email", email != null ? email : jwt.getSubject()
            ));
        } catch (Exception e) {
            log.error("Token validation error: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }

    /**
     * Obtener información del usuario desde el token Auth0
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getClaim("email");
            String name = jwt.getClaim("name");
            String picture = jwt.getClaim("picture");

            if (email != null) {
                try {
                    UserDto user = userService.getUserByEmail(email);
                    return ResponseEntity.ok(Map.of(
                            "user", user,
                            "authenticated", true
                    ));
                } catch (Exception e) {
                    // Usuario no existe en DB, crear uno nuevo
                    log.info("User not found, creating from Auth0 token: {}", email);
                    UserDto newUser = userService.createUserFromAuth0(email, name, picture);
                    return ResponseEntity.ok(Map.of(
                            "user", newUser,
                            "authenticated", true
                    ));
                }
            }

            throw new RuntimeException("Unable to extract user information from token");
        } catch (Exception e) {
            log.error("Error getting current user: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of(
                    "authenticated", false,
                    "error", "Invalid or expired token"
            ));
        }
    }
}