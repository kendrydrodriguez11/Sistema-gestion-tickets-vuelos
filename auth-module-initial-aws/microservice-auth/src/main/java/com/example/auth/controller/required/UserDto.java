package com.example.auth.controller.required;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    @NotNull
    private UUID id;

    @NotBlank
    private String username;

    @NotBlank
    private String email;

    @NotBlank
    private String locationPhoto;

}
