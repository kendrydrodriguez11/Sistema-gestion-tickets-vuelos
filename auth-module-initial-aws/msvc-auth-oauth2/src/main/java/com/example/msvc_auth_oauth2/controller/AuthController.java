package com.example.msvc_auth_oauth2.controller;

import com.example.msvc_auth_oauth2.dto.TokenValidationDto;
import com.example.msvc_auth_oauth2.dto.UserDto;
import com.example.msvc_auth_oauth2.service.AuthService;
import com.example.msvc_auth_oauth2.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final JwtDecoder jwtDecoder;
    private final RestTemplate restTemplate;
    private final AuthService authService;

    @Value("${auth0.domain}")
    private String auth0Domain;


    @PostMapping("/introspect")
    public ResponseEntity<TokenValidationDto> introspectToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        log.info("Token introspection");

        if (token == null || token.isBlank()) {
            return ResponseEntity.ok(TokenValidationDto.builder().active(false).build());
        }

        try {
            Jwt jwt = jwtDecoder.decode(token);
            return ResponseEntity.ok(authService.buildValidation(jwt));
        } catch (JwtException e) {
            return ResponseEntity.ok(TokenValidationDto.builder().active(false).build());
        }
    }


    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader("Authorization") String header) {
        try {
            String token = header.replace("Bearer ", "");
            Jwt jwt = jwtDecoder.decode(token);
            String email = jwt.getClaim("email");

            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "email", email != null ? email : jwt.getSubject()
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }


    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String header) {
        try {
            String token = header.replace("Bearer ", "");
            Jwt jwt = jwtDecoder.decode(token);
            String url = "https://" + auth0Domain + "/userinfo";
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, new HttpEntity<>(headers), Map.class
            );
            Map<String, Object> info = response.getBody();
            String email = (String) info.get("email");
            if (email == null) {
                return ResponseEntity.status(401).body(Map.of(
                        "authenticated", false,
                        "error", "Email missing in Auth0 userinfo"
                ));
            }
            UserDto user = authService.getOrCreateUser(email,
                    (String) info.get("name"),
                    (String) info.get("picture")
            );
            return ResponseEntity.ok(Map.of(
                    "user", user,
                    "authenticated", true
            ));

        } catch (JwtException e) {
            return ResponseEntity.status(401).body(Map.of(
                    "authenticated", false,
                    "error", "Invalid or expired token"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of(
                    "authenticated", false,
                    "error", "Failed to retrieve user information"
            ));
        }
    }


    @GetMapping("/jwks")
    public ResponseEntity<Map<String, Object>> getJwks() {
        try {
            String auth0JwksUrl = "https://" + auth0Domain + "/.well-known/jwks.json";

            ResponseEntity<Map> response = restTemplate.exchange(
                    auth0JwksUrl,
                    HttpMethod.GET,
                    null,
                    Map.class
            );

            return ResponseEntity.ok((Map<String, Object>) response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

}
