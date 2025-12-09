package com.example.msvc_auth_oauth2.service;

import com.example.msvc_auth_oauth2.dto.TokenValidationDto;
import com.example.msvc_auth_oauth2.dto.UserDto;
import org.springframework.security.oauth2.jwt.Jwt;

public interface AuthService {
    TokenValidationDto buildValidation(Jwt jwt);
    UserDto getOrCreateUser(String email, String name, String picture);
}
