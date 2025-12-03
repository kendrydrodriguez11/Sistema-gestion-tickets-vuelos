package com.example.auth.service;

import java.time.Duration;
import java.util.Optional;

public interface CacheService {
    void save(String key, Object value, Duration ttl);
    <T> Optional<T> get(String key, Class<T> type);
    void delete(String key);
    void deletePattern(String pattern);
    boolean exists(String key);
}