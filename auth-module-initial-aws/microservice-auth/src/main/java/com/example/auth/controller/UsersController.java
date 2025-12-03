package com.example.auth.controller;

import com.example.auth.controller.required.UserDto;
import com.example.auth.controller.required.UserProfileDto;
import com.example.auth.model.EntityUser;
import com.example.auth.service.DetailsUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RequestMapping("/api/auth")
@RestController
public class UsersController {

    private final DetailsUser detailsUser;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> foundAllUsers() {
        return ResponseEntity.ok(detailsUser.foundUser());
    }

    @GetMapping("/user")
    public ResponseEntity<UserDto> foundUserByUsername(@RequestParam String username) {
        return ResponseEntity.ok(detailsUser.findUserByUsername(username));
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        detailsUser.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/user")
    public ResponseEntity<Void> updateUser(@RequestBody UserProfileDto user) {
        detailsUser.updateUser(user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/details")
    public ResponseEntity<EntityUser> getDetailsUser(@RequestParam String username) {
        return ResponseEntity.ok(detailsUser.getDetailsUser(username));
    }
}
