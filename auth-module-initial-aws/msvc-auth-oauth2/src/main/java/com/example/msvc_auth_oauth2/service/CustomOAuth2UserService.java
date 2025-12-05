package com.example.msvc_auth_oauth2.service;

import com.example.msvc_auth_oauth2.model.RoleEntity;
import com.example.msvc_auth_oauth2.model.UserEntity;
import com.example.msvc_auth_oauth2.model.UserRole;
import com.example.msvc_auth_oauth2.repository.RoleRepository;
import com.example.msvc_auth_oauth2.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        log.info("OAuth2 login attempt from provider: {}",
                userRequest.getClientRegistration().getRegistrationId());

        try {
            return processOAuth2User(userRequest, oauth2User);
        } catch (Exception ex) {
            log.error("Error processing OAuth2 user", ex);
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oauth2User) {
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String givenName = oauth2User.getAttribute("given_name");
        String familyName = oauth2User.getAttribute("family_name");
        String picture = oauth2User.getAttribute("picture");

        log.info("Processing OAuth2 user - Email: {}, Name: {}", email, name);

        if (email == null || email.isEmpty()) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        UserEntity user = userRepository.findByEmail(email)
                .map(existingUser -> updateExistingUser(existingUser, name, givenName, familyName, picture))
                .orElseGet(() -> createNewUser(email, name, givenName, familyName, picture));

        log.info("User processed successfully: {}", user.getUsername());
        return oauth2User;
    }

    private UserEntity updateExistingUser(UserEntity user, String name, String givenName,
                                          String familyName, String picture) {
        log.info("Updating existing user: {}", user.getEmail());

        user.setLastLogin(LocalDateTime.now());

        if (givenName != null && !givenName.equals(user.getFirstName())) {
            user.setFirstName(givenName);
        }
        if (familyName != null && !familyName.equals(user.getLastName())) {
            user.setLastName(familyName);
        }

        return userRepository.save(user);
    }

    private UserEntity createNewUser(String email, String name, String givenName,
                                     String familyName, String picture) {
        log.info("Creating new user from OAuth2: {}", email);

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

        UserEntity newUser = UserEntity.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString())) // Password random
                .firstName(givenName != null ? givenName : name)
                .lastName(familyName)
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .roles(new HashSet<>())
                .lastLogin(LocalDateTime.now())
                .build();

        newUser.addRole(userRole);

        UserEntity savedUser = userRepository.save(newUser);
        log.info("New user created successfully: {}", savedUser.getUsername());

        return savedUser;
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
}