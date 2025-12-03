package com.example.microservice_inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableFeignClients
@EnableDiscoveryClient
@SpringBootApplication
public class MicroserviceInventoryApplication {

	public static void main(String[] args) {
		SpringApplication.run(MicroserviceInventoryApplication.class, args);
	}
}