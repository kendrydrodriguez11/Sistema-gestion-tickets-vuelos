package com.example.auth.controller;

import com.example.auth.service.jwt.JwtAuth;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RequiredArgsConstructor
@RequestMapping("/api/auth")
@RestController
public class TokenController {
    private final JwtAuth jwtAuth;



    @PostMapping("/validationToken")
    public ResponseEntity<Map<String, Boolean>> validationToken(@RequestBody Map<String, String> request) {
        boolean isValid = jwtAuth.ValidationToken(request.get("token"));
        return ResponseEntity.ok(Map.of("isValid", isValid));
    }
}
