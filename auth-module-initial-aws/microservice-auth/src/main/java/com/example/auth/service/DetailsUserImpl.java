package com.example.auth.service;

import com.example.auth.config.ConfigurationAuth;
import com.example.auth.controller.required.UserDto;
import com.example.auth.controller.required.UserProfileDto;
import com.example.auth.model.EntityUser;
import com.example.auth.repository.AuthRepository;
import com.example.auth.repository.DetailsUserRep;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class DetailsUserImpl implements DetailsUser{
    private final DetailsUserRep detailsUserRep;
    private final AuthRepository authRepository;


    @Override
    public UserDto findUserByUsername(String username) {
        EntityUser user = getDetailsUser(username);
        UserDto userFinal = UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .locationPhoto(user.getUrlPhotoAws())
                .build();
        return  userFinal;
    }

    @Override
    public List<UserDto> foundUser() {
        List<EntityUser> users = (List<EntityUser>) authRepository.findAll();
        List<UserDto> userFinal = users.stream()
                .map(user -> UserDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .locationPhoto(user.getUrlPhotoAws())
                        .build())
                .toList();
        return  userFinal;
    }

    @Override
    public void deleteUser(UUID idUser) {
        authRepository.deleteById(idUser);
    }

    @Override
    public void updateUser(UserProfileDto user) {
        EntityUser entityUser = EntityUser.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .password(user.getPassword())
                .urlPhotoAws(user.getLocationPhoto())
                .build();

        authRepository.save(entityUser);

    }

    @Override
    public EntityUser getDetailsUser(String name) {
        EntityUser user = detailsUserRep.UserDetailsWithName(name);
        if(user != null) return user;
        throw new UsernameNotFoundException("User not fund: " + name);
    }


}
