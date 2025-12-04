package com.example.microservice_change.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class DenominationLockService {

    private final RedisTemplate<String, String> redisTemplate;
    private static final Duration LOCK_TIMEOUT = Duration.ofSeconds(30);

    public boolean acquireLock(UUID denominationId, String owner) {
        String lockKey = "lock:denomination:" + denominationId;
        Boolean acquired = redisTemplate.opsForValue()
                .setIfAbsent(lockKey, owner, LOCK_TIMEOUT);
        if (Boolean.TRUE.equals(acquired)) {
            log.debug("Lock acquired for denomination {} by {}", denominationId, owner);
            return true;
        }
        log.warn("Failed to acquire lock for denomination {}", denominationId);
        return false;
    }

    public void releaseLock(UUID denominationId, String owner) {
        String lockKey = "lock:denomination:" + denominationId;
        String currentOwner = redisTemplate.opsForValue().get(lockKey);
        if (owner.equals(currentOwner)) {
            redisTemplate.delete(lockKey);
            log.debug("Lock released for denomination {} by {}", denominationId, owner);
        } else {
            log.warn("Cannot release lock for denomination {} - owner mismatch", denominationId);
        }
    }
}
