package com.example.auth.repository;

import com.example.auth.model.EntityUser;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface AuthRepository extends CrudRepository<EntityUser, UUID> {
}
