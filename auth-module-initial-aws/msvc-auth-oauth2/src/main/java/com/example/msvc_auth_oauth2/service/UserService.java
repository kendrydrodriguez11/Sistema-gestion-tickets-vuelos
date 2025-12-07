package com.example.msvc_auth_oauth2.service;

import com.example.msvc_auth_oauth2.dto.UserDto;
import com.example.msvc_auth_oauth2.model.UserRole;

import java.util.UUID;

public interface UserService {
    UserDto getUserById(UUID id);
    UserDto getUserByUsername(String username);
    UserDto getUserByEmail(String email);
    UserDto addRoleToUser(UUID userId, UserRole role);
    UserDto removeRoleFromUser(UUID userId, UserRole role);
    void updateLastLogin(String username);
    void updateLastLoginByEmail(String email);
    UserDto createUserFromAuth0(String email, String name, String picture);
}