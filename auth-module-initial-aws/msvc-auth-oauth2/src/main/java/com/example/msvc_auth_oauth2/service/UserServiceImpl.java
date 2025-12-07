package com.example.msvc_auth_oauth2.service;

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

    @Override
    @Transactional
    public void updateLastLoginByEmail(String email) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        log.debug("Last login updated for email: {}", email);
    }

    @Override
    @Transactional
    public UserDto createUserFromAuth0(String email, String name, String picture) {
        log.info("Creating new user from Auth0: {}", email);

        // Verificar si ya existe
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("User already exists with email: " + email);
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

        // Generar username único a partir del email
        String username = generateUniqueUsername(email);

        // Parsear nombre
        String firstName = null;
        String lastName = null;
        if (name != null && !name.isEmpty()) {
            String[] nameParts = name.split(" ", 2);
            firstName = nameParts[0];
            if (nameParts.length > 1) {
                lastName = nameParts[1];
            }
        }

        UserEntity newUser = UserEntity.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString())) // Password random
                .firstName(firstName)
                .lastName(lastName)
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .roles(new HashSet<>())
                .lastLogin(LocalDateTime.now())
                .build();

        newUser.addRole(userRole);

        UserEntity savedUser = userRepository.save(newUser);
        log.info("New user created successfully from Auth0: {}", savedUser.getUsername());

        return mapToDto(savedUser);
    }

    private String generateUniqueUsername(String email) {
        String baseUsername = email.split("@")[0];
        String username = baseUsername;
        int counter = 1;

        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }

        return username;
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