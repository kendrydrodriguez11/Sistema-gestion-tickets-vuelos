package com.example.auth.controller.required;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginUser {
    @NotBlank
    private String username;


    @NotBlank
    private String password;
}
