package com.example.msvc_auth_oauth2.service;

import com.example.msvc_auth_oauth2.model.UserEntity;
import com.example.msvc_auth_oauth2.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Slf4j
@RequiredArgsConstructor
@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");

        log.info("OAuth2 login successful for email: {}", email);

        try {
            // Actualizar last login
            UserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found after OAuth2 login"));

            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            // Generar JWT token personalizado
            String token = jwtService.generateToken(user);

            log.info("JWT token generated for user: {}", user.getUsername());

            // Redirigir al frontend con el token
            String redirectUrl = String.format("%s/oauth2/redirect?token=%s", frontendUrl, token);

            getRedirectStrategy().sendRedirect(request, response, redirectUrl);

        } catch (Exception e) {
            log.error("Error in OAuth2 success handler", e);
            getRedirectStrategy().sendRedirect(request, response, frontendUrl + "/login?error=true");
        }
    }
}