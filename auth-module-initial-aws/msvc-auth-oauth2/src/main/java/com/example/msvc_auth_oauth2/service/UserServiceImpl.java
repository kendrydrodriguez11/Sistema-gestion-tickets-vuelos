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
import org.springframework.dao.DataIntegrityViolationException;

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
                            .users(new HashSet<>())
                            .build();
                    return roleRepository.save(newRole);
                });

        user.getRoles().add(role);
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

        user.getRoles().remove(role);
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

    /**
     * ✅ CORREGIDO: Sin verificación doble, dejar que la BD maneje la constraint
     */
    @Override
    @Transactional
    public UserDto createUserFromAuth0(String email, String name, String picture) {
        log.info("Creating new user from Auth0: {}", email);

        try {
            // ✅ CAMBIO: No verificar existencia, dejar que la BD lance la excepción

            // Obtener o crear rol USER
            RoleEntity userRole = roleRepository.findByName(UserRole.ROLE_USER)
                    .orElseGet(() -> {
                        RoleEntity role = RoleEntity.builder()
                                .name(UserRole.ROLE_USER)
                                .description("Default user role")
                                .build();
                        return roleRepository.save(role);
                    });

            // Generar username único
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

            // Crear nuevo usuario
            UserEntity newUser = UserEntity.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .firstName(firstName)
                    .lastName(lastName)
                    .enabled(true)
                    .accountNonExpired(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .roles(new HashSet<>())
                    .lastLogin(LocalDateTime.now())
                    .build();

            // IMPORTANTE: Agregar rol ANTES de guardar
            newUser.getRoles().add(userRole);

            // Guardar usuario
            log.info("Attempting to save user with email: {}", email);
            UserEntity savedUser = userRepository.save(newUser);

            log.info("✅ User created successfully from Auth0: {} (ID: {})",
                    savedUser.getUsername(), savedUser.getId());

            return mapToDto(savedUser);

        } catch (DataIntegrityViolationException e) {
            // La excepción se lanza porque el email ya existe
            log.warn("⚠️ User already exists with email: {}", email);
            log.warn("Exception: {}", e.getMessage());

            // Intentar obtener el usuario que ya existe
            try {
                UserEntity existingUser = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException(
                                "User creation failed but user not found either: " + email
                        ));

                log.info("✅ Retrieved existing user: {}", existingUser.getUsername());
                return mapToDto(existingUser);

            } catch (Exception getError) {
                log.error("❌ Failed to retrieve existing user: {}", email, getError);
                throw new RuntimeException(
                        "User already exists with email: " + email, e
                );
            }

        } catch (Exception e) {
            log.error("❌ Error creating user from Auth0: {}", e.getMessage(), e);
            throw new RuntimeException(
                    "Failed to create user from Auth0: " + e.getMessage(), e
            );
        }
    }

    private String generateUniqueUsername(String email) {
        String baseUsername = email.split("@")[0].replaceAll("[^a-zA-Z0-9_]", "");
        String username = baseUsername;
        int counter = 1;

        // Truncar si es muy largo
        int maxLength = 50;
        if (baseUsername.length() > maxLength) {
            baseUsername = baseUsername.substring(0, maxLength);
        }

        username = baseUsername;
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;

            // Evitar desbordamiento
            if (counter > 1000) {
                username = UUID.randomUUID().toString().substring(0, 20);
                break;
            }
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