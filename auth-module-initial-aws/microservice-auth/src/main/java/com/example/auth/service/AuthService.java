package com.example.auth.service;

import com.example.auth.controller.required.LoginUser;

import java.util.Map;

public interface AuthService {
    Map<String, Object> registerUser(String username, String email, String password, String bucketName);

    String authenticateUser(LoginUser user);

}
