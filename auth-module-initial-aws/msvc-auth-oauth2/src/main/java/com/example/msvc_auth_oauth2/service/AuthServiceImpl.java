package com.example.msvc_auth_oauth2.service;

import com.example.msvc_auth_oauth2.dto.TokenValidationDto;
import com.example.msvc_auth_oauth2.dto.UserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;


@Slf4j
@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements  AuthService{
    private final UserService userService;

    public TokenValidationDto buildValidation(Jwt jwt) {
        String username = jwt.getSubject();
        String email = jwt.getClaim("email");
        Instant exp = jwt.getExpiresAt();
        Instant iat = jwt.getIssuedAt();
        Set<String> scopes = new HashSet<>();
        Object scopeClaim = jwt.getClaim("scope");
        if (scopeClaim instanceof String scopeStr) {
            scopes.addAll(Arrays.asList(scopeStr.split(" ")));
        }
        boolean isActive = exp != null && exp.isAfter(Instant.now());
        if (isActive && email != null) {
            try {
                userService.updateLastLoginByEmail(email);
            } catch (Exception ignored) {
            }
        }
        return TokenValidationDto.builder()
                .active(isActive)
                .username(email != null ? email : username)
                .sub(username)
                .scope(scopes)
                .exp(exp != null ? exp.getEpochSecond() : null)
                .iat(iat != null ? iat.getEpochSecond() : null)
                .clientId(jwt.getClaim("azp"))
                .build();
    }


    public UserDto getOrCreateUser(String email, String name, String picture) {
        int retries = 3;

        for (int i = 0; i < retries; i++) {
            try {
                return userService.getUserByEmail(email);
            } catch (RuntimeException ignored) {
                try {
                    return userService.createUserFromAuth0(email, name, picture);
                } catch (IllegalArgumentException ex) {
                    if (ex.getMessage() != null && ex.getMessage().contains("already exists")) {
                        try {
                            Thread.sleep(100L * (long) Math.pow(2, i));
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                            throw new RuntimeException("Interrupted during retry", ie);
                        }
                    } else {
                        throw ex;
                    }
                }
            }
        }

        throw new RuntimeException("Failed to fetch/create user after retries: " + email);
    }
}
