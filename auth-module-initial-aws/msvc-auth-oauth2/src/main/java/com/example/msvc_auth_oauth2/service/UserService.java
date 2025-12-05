package com.example.msvc_auth_oauth2.service;

import com.example.msvc_auth_oauth2.dto.RegisterDto;
import com.example.msvc_auth_oauth2.dto.UserDto;
import com.example.msvc_auth_oauth2.model.UserRole;

import java.util.UUID;

public interface UserService {
    UserDto registerUser(RegisterDto registerDto);
    UserDto getUserById(UUID id);
    UserDto getUserByUsername(String username);
    UserDto addRoleToUser(UUID userId, UserRole role);
    UserDto removeRoleFromUser(UUID userId, UserRole role);
    void updateLastLogin(String username);
}