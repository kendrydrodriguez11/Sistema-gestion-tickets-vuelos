package com.example.msvc_auth_oauth2.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenValidationDto {
    private Boolean active;
    private String username;
    private String sub;
    private Set<String> scope;
    private Long exp;
    private Long iat;
    private String clientId;
}