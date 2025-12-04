package com.example.msvc_auth_oauth2.repository;

import com.example.msvc_auth_oauth2.model.RoleEntity;
import com.example.msvc_auth_oauth2.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<RoleEntity, UUID> {

    Optional<RoleEntity> findByName(UserRole name);
}