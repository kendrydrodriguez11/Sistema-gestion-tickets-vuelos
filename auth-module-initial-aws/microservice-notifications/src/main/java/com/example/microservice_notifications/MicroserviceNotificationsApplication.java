package com.example.microservice_notifications;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class MicroserviceNotificationsApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroserviceNotificationsApplication.class, args);
	}
}