package com.example.msvc_auth_oauth2.controller;

import com.example.msvc_auth_oauth2.dto.UserDto;
import com.example.msvc_auth_oauth2.model.UserRole;
import com.example.msvc_auth_oauth2.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    /**
     * Obtener perfil del usuario actual
     */
    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        UserDto user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    /**
     * Obtener usuario por ID (solo admins)
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> getUserById(@PathVariable UUID id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Agregar rol a usuario (solo admins)
     */
    @PostMapping("/{id}/roles/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> addRole(
            @PathVariable UUID id,
            @PathVariable UserRole role) {
        UserDto user = userService.addRoleToUser(id, role);
        return ResponseEntity.ok(user);
    }

    /**
     * Remover rol de usuario (solo admins)
     */
    @DeleteMapping("/{id}/roles/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> removeRole(
            @PathVariable UUID id,
            @PathVariable UserRole role) {
        UserDto user = userService.removeRoleFromUser(id, role);
        return ResponseEntity.ok(user);
    }
}