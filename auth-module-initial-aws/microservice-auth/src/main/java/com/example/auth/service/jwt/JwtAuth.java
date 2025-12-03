package com.example.auth.service.jwt;

import com.example.auth.model.EntityUser;

public interface JwtAuth {
    String CreatedToken(EntityUser user);

    boolean ValidationToken(String token);
}
