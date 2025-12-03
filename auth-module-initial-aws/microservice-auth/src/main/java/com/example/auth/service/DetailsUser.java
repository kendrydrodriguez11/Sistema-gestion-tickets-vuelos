package com.example.auth.service;

import com.example.auth.controller.required.UserDto;
import com.example.auth.controller.required.UserProfileDto;
import com.example.auth.model.EntityUser;

import java.util.List;
import java.util.UUID;

public interface DetailsUser {
    UserDto findUserByUsername(String username);

    List<UserDto> foundUser();

    void deleteUser(UUID idUser);

    void updateUser(UserProfileDto user);

    EntityUser getDetailsUser(String user);
}
