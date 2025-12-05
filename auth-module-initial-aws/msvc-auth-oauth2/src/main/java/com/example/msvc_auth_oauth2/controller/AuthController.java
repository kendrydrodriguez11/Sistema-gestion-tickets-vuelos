package com.example.msvc_auth_oauth2.controller;

import com.example.msvc_auth_oauth2.dto.RegisterDto;
import com.example.msvc_auth_oauth2.dto.TokenValidationDto;
import com.example.msvc_auth_oauth2.dto.UserDto;
import com.example.msvc_auth_oauth2.service.JwtService;
import com.example.msvc_auth_oauth2.service.UserService;
import jakarta.validation.Valid;
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
    private final JwtService jwtService;

    @Value("${auth0.domain}")
    private String auth0Domain;

    @Value("${app.frontend.url}")
    private String frontendUrl;

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
     * Endpoint de información de login
     */
    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> loginInfo() {
        return ResponseEntity.ok(Map.of(
                "google_login_url", "http://localhost:8081/oauth2/authorization/google",
                "auth0_login_url", "https://" + auth0Domain + "/authorize",
                "message", "Use OAuth2 login with Google or Auth0"
        ));
    }

    /**
     * Iniciar login con Google
     */
    @GetMapping("/google/login")
    public ResponseEntity<Map<String, String>> googleLogin() {
        return ResponseEntity.ok(Map.of(
                "redirect_url", "http://localhost:8081/oauth2/authorization/google"
        ));
    }

    /**
     * Endpoint de introspección de tokens
     * Valida tanto tokens JWT propios como tokens de Auth0
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
            // Primero intenta validar como token JWT propio
            if (validateOwnToken(token)) {
                return ResponseEntity.ok(buildValidationFromOwnToken(token));
            }

            // Si no es token propio, intenta validar como token de Auth0
            Jwt jwt = jwtDecoder.decode(token);
            return ResponseEntity.ok(buildValidationFromJwt(jwt));

        } catch (Exception e) {
            log.error("Token validation failed: {}", e.getMessage());
            return ResponseEntity.ok(TokenValidationDto.builder()
                    .active(false)
                    .build());
        }
    }

    private boolean validateOwnToken(String token) {
        try {
            String username = jwtService.extractUsername(token);
            return !jwtService.isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private TokenValidationDto buildValidationFromOwnToken(String token) {
        String username = jwtService.extractUsername(token);

        try {
            userService.updateLastLogin(username);
        } catch (Exception e) {
            log.warn("Failed to update last login for user: {}", username);
        }

        return TokenValidationDto.builder()
                .active(true)
                .username(username)
                .sub(username)
                .scope(Set.of("user"))
                .build();
    }

    private TokenValidationDto buildValidationFromJwt(Jwt jwt) {
        String username = jwt.getSubject();
        Instant expiration = jwt.getExpiresAt();
        Instant issuedAt = jwt.getIssuedAt();

        // Extraer scopes de forma segura
        Set<String> scopes = new HashSet<>();
        try {
            Object scopeClaim = jwt.getClaim("scope");
            if (scopeClaim != null) {
                if (scopeClaim instanceof String) {
                    // Si scope es un string separado por espacios
                    scopes.addAll(Arrays.asList(((String) scopeClaim).split(" ")));
                } else if (scopeClaim instanceof Collection) {
                    // Si scope es una colección
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

        if (isActive && username != null) {
            try {
                userService.updateLastLogin(username);
            } catch (Exception e) {
                log.warn("Failed to update last login for user: {}", username);
            }
        }

        return TokenValidationDto.builder()
                .active(isActive)
                .username(username)
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
            String username = jwtService.extractUsername(token);
            boolean isValid = jwtService.validateToken(token, username);

            return ResponseEntity.ok(Map.of(
                    "valid", isValid,
                    "username", username
            ));
        } catch (Exception e) {
            log.error("Token validation error: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }

    /**
     * Obtener información del usuario desde el token
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");

            // Intentar primero con token propio
            try {
                String username = jwtService.extractUsername(token);
                UserDto user = userService.getUserByUsername(username);
                return ResponseEntity.ok(Map.of(
                        "user", user,
                        "authenticated", true
                ));
            } catch (Exception e) {
                // Si falla, intentar con Auth0 JWT
                Jwt jwt = jwtDecoder.decode(token);
                String email = jwt.getClaim("email");

                if (email != null) {
                    UserDto user = userService.getUserByEmail(email);
                    return ResponseEntity.ok(Map.of(
                            "user", user,
                            "authenticated", true
                    ));
                }

                throw new RuntimeException("Unable to extract user information from token");
            }
        } catch (Exception e) {
            log.error("Error getting current user: {}", e.getMessage());
            return ResponseEntity.status(401).body(Map.of(
                    "authenticated", false,
                    "error", "Invalid or expired token"
            ));
        }
    }
}