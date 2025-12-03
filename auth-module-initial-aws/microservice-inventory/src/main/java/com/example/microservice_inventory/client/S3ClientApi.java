package com.example.microservice_inventory.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(name = "microservice-aws", url = "localhost:8082")
public interface S3ClientApi {

    @GetMapping("/api/aws/presigned-url/put")
    String getPresignedPutUrl(@RequestParam String bucketName, @RequestParam String key);

    @GetMapping("/api/aws/presigned-url/get")
    String getPresignedGetUrl(@RequestParam String bucketName, @RequestParam String key);
}
