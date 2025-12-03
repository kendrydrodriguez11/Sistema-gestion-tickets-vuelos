package com.example.auth.controller;


import com.example.auth.model.UserActivity;
import com.example.auth.repository.UserActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth/activity")
public class UserActivityController {

    private final UserActivityRepository userActivityRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<UserActivity>> getUserActivity(
            @PathVariable UUID userId,
            Pageable pageable) {
        return ResponseEntity.ok(userActivityRepository.findByUserId(userId, pageable));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<UserActivity>> getRecentActivity(@RequestParam(defaultValue = "24") int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        return ResponseEntity.ok(userActivityRepository.findByCreatedAtAfter(since));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<Page<UserActivity>> getActivityByUsername(
            @PathVariable String username,
            Pageable pageable) {
        return ResponseEntity.ok(userActivityRepository.findByUsername(username, pageable));
    }
}