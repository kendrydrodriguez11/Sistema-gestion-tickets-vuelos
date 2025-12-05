package com.example.msvc_auth_oauth2.service;

import com.example.msvc_auth_oauth2.dto.RegisterDto;
import com.example.msvc_auth_oauth2.dto.UserDto;
import com.example.msvc_auth_oauth2.model.RoleEntity;
import com.example.msvc_auth_oauth2.model.UserEntity;
import com.example.msvc_auth_oauth2.model.UserRole;
import com.example.msvc_auth_oauth2.repository.RoleRepository;
import com.example.msvc_auth_oauth2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDto registerUser(RegisterDto registerDto) {
        log.info("Registering new user: {}", registerDto.getUsername());

        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Obtener o crear rol USER
        RoleEntity userRole = roleRepository.findByName(UserRole.ROLE_USER)
                .orElseGet(() -> {
                    RoleEntity role = RoleEntity.builder()
                            .name(UserRole.ROLE_USER)
                            .description("Default user role")
                            .build();
                    return roleRepository.save(role);
                });

        UserEntity user = UserEntity.builder()
                .username(registerDto.getUsername())
                .email(registerDto.getEmail())
                .password(passwordEncoder.encode(registerDto.getPassword()))
                .firstName(registerDto.getFirstName())
                .lastName(registerDto.getLastName())
                .phone(registerDto.getPhone())
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .roles(new HashSet<>())
                .build();

        user.addRole(userRole);

        UserEntity savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getId());

        return mapToDto(savedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(UUID id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return mapToDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserByUsername(String username) {
        UserEntity user = userRepository.findByUsernameWithRoles(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return mapToDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserByEmail(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return mapToDto(user);
    }

    @Override
    @Transactional
    public UserDto addRoleToUser(UUID userId, UserRole roleName) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RoleEntity role = roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    RoleEntity newRole = RoleEntity.builder()
                            .name(roleName)
                            .description(roleName.name() + " role")
                            .build();
                    return roleRepository.save(newRole);
                });

        user.addRole(role);
        UserEntity updated = userRepository.save(user);

        log.info("Role {} added to user {}", roleName, userId);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public UserDto removeRoleFromUser(UUID userId, UserRole roleName) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        RoleEntity role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.removeRole(role);
        UserEntity updated = userRepository.save(user);

        log.info("Role {} removed from user {}", roleName, userId);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public void updateLastLogin(String username) {
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.debug("Last login updated for user: {}", username);
    }

    private UserDto mapToDto(UserEntity entity) {
        Set<String> roles = entity.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return UserDto.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .email(entity.getEmail())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .phone(entity.getPhone())
                .enabled(entity.getEnabled())
                .roles(roles)
                .createdAt(entity.getCreatedAt())
                .lastLogin(entity.getLastLogin())
                .build();
    }
}