package com.example.auth.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "microservice-aws", url = "http://localhost:8082")
public interface S3ClientApi {
    @GetMapping("/api/aws/presigned-url")
    String getPresignedUrl(@RequestParam String bucketName, @RequestParam String key);
}
