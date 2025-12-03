package com.example.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;

@Slf4j
@RequiredArgsConstructor
@Service
public class CacheServiceImpl implements CacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public void save(String key, Object value, Duration ttl) {
        try {
            redisTemplate.opsForValue().set(key, value, ttl);
            log.debug("Cached key: {}", key);
        } catch (Exception e) {
            log.error("Error caching key {}: {}", key, e.getMessage());
        }
    }

    @Override
    public <T> Optional<T> get(String key, Class<T> type) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            if (value != null && type.isInstance(value)) {
                log.debug("Cache hit for key: {}", key);
                return Optional.of(type.cast(value));
            }
            log.debug("Cache miss for key: {}", key);
        } catch (Exception e) {
            log.error("Error retrieving cache for key {}: {}", key, e.getMessage());
        }
        return Optional.empty();
    }

    @Override
    public void delete(String key) {
        try {
            redisTemplate.delete(key);
            log.debug("Deleted cache key: {}", key);
        } catch (Exception e) {
            log.error("Error deleting cache key {}: {}", key, e.getMessage());
        }
    }

    @Override
    public void deletePattern(String pattern) {
        try {
            Set<String> keys = redisTemplate.keys(pattern);
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.debug("Deleted {} keys matching pattern: {}", keys.size(), pattern);
            }
        } catch (Exception e) {
            log.error("Error deleting cache pattern {}: {}", pattern, e.getMessage());
        }
    }

    @Override
    public boolean exists(String key) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.error("Error checking cache existence for key {}: {}", key, e.getMessage());
            return false;
        }
    }
}