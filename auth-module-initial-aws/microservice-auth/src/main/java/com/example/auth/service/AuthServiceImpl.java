package com.example.auth.service;

import com.example.auth.client.S3ClientApi;
import com.example.auth.controller.required.LoginUser;
import com.example.auth.model.EntityRoles;
import com.example.auth.model.EntityUser;
import com.example.auth.model.RolesE;
import com.example.auth.model.UserActivity;
import com.example.auth.repository.AuthRepository;
import com.example.auth.repository.UserActivityRepository;
import com.example.auth.service.jwt.JwtAuth;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;

import java.time.Duration;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.slf4j.LoggerFactory;

@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final AuthenticationManager authenticationManager;
    private final DetailsUser detailsUser;
    private final JwtAuth jwtAuth;
    private final PasswordEncoder passwordEncoder;
    private final S3ClientApi s3ClientApi;
    private final UserActivityRepository userActivityRepository;
    private final CacheService cacheService;

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Override
    public Map<String, Object> registerUser(String username, String email, String password, String bucketName) {

        String cacheKey = "user:check:" + username;

        if (cacheService.exists(cacheKey)) {
            throw new RuntimeException("Username already exists");
        }

        // Roles
        Set<EntityRoles> rol = new HashSet<>();
        rol.add(EntityRoles.builder().name(RolesE.USER).build());

        // Crear usuario base
        EntityUser user = EntityUser.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .roles(rol)
                .build();

        try {
            EntityUser savedUser = authRepository.save(user);

            String key = null;
            String uploadUrl = null;

            // Generar key con extensión incluida (corrección principal)
            if (bucketName != null && !bucketName.isEmpty()) {
                key = "profiles/" + savedUser.getId() + ".png";   // ✔ Correcto
                uploadUrl = s3ClientApi.getPresignedUrl(bucketName, key);
            }

            System.out.println("Generated S3 key: " + key);

            // Construcción correcta de URL final
            String finalFileUrl = (key != null)
                    ? "https://" + bucketName + ".s3.amazonaws.com/" + key  // ✔ URL coherente
                    : null;

            savedUser.setUrlPhotoAws(finalFileUrl);
            authRepository.save(savedUser);

            // Cache
            cacheService.save("user:" + username, savedUser, Duration.ofHours(1));
            cacheService.save(cacheKey, true, Duration.ofHours(24));

            // Log de actividad
            UserActivity activity = UserActivity.builder()
                    .userId(savedUser.getId())
                    .username(username)
                    .action("USER_REGISTERED")
                    .build();
            userActivityRepository.save(activity);

            return Map.of(
                    "message", "User registered successfully",
                    "uploadUrl", (uploadUrl != null ? uploadUrl : ""),
                    "fileUrl", (finalFileUrl != null ? finalFileUrl : "")
            );

        } catch (Exception e) {
            logger.error("Error in register", e);
            throw new RuntimeException("Error registering user", e);
        }
    }


    @Override
    public String authenticateUser(LoginUser user) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
        );

        EntityUser userLogin = detailsUser.getDetailsUser(user.getUsername());
        String token = jwtAuth.CreatedToken(userLogin);

        // Cache token validation
        cacheService.save("token:" + token, userLogin.getId(), Duration.ofHours(1));

        // Log
        UserActivity activity = UserActivity.builder()
                .userId(userLogin.getId())
                .username(user.getUsername())
                .action("USER_LOGIN")
                .build();
        userActivityRepository.save(activity);

        return token;
    }
}
