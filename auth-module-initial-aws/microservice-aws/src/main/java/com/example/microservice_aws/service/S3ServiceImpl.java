package com.example.microservice_aws.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.List;

@RequiredArgsConstructor
@Service
public class S3ServiceImpl implements S3Service {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private static final Logger logger = LoggerFactory.getLogger(S3ServiceImpl.class);

    @Value("${spring.aws.region}")
    private String region;

    @Override
    public String createBucket(String bucketName) {
        CreateBucketResponse response = s3Client.createBucket(
                builder -> builder.bucket(bucketName)
        );




        CORSRule corsRule = CORSRule.builder()
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "PUT", "POST", "HEAD")
                .allowedHeaders("*")
                .exposeHeaders("ETag")
                .maxAgeSeconds(3000)
                .build();

        CORSConfiguration corsConfig = CORSConfiguration.builder()
                .corsRules(corsRule)
                .build();

        s3Client.putBucketCors(
                PutBucketCorsRequest.builder()
                        .bucket(bucketName)
                        .corsConfiguration(corsConfig)
                        .build()
        );

        return "Bucket creado y configurado con CORS: " + response.location();
    }

    @Override
    public Boolean checkIfBucketExist(String bucketName) {
        try {
            s3Client.headBucket(req -> req.bucket(bucketName));
            return true;
        } catch (S3Exception e) {
            return false;
        }
    }

    @Override
    public List<String> getAllBuckets() {
        ListBucketsResponse response = s3Client.listBuckets();
        if (!response.hasBuckets()) return List.of();
        return response.buckets().stream().map(Bucket::name).toList();
    }

    @Override
    public String generatePresignedPutUrl(String bucketName, String key) {
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        PresignedPutObjectRequest presignedRequest =
                s3Presigner.presignPutObject(p ->
                        p.signatureDuration(Duration.ofMinutes(10))
                                .putObjectRequest(putRequest)
                );

        return presignedRequest.url().toString();
    }

    @Override
    public String generatePresignedGetUrl(String bucketName, String key) {
        GetObjectRequest getRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build();

        PresignedGetObjectRequest presignedRequest =
                s3Presigner.presignGetObject(p ->
                        p.signatureDuration(Duration.ofMinutes(10))
                                .getObjectRequest(getRequest)
                );

        return presignedRequest.url().toString();
    }

}
