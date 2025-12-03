package com.example.auth.repository;

import com.example.auth.model.UserActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface UserActivityRepository extends JpaRepository<UserActivity, UUID> {
    Page<UserActivity> findByUserId(UUID userId, Pageable pageable);
    Page<UserActivity> findByUsername(String username, Pageable pageable);
    List<UserActivity> findByCreatedAtAfter(LocalDateTime dateTime);
}