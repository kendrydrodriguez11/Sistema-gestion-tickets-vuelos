package com.example.msvc_auth_oauth2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class MsvcAuthOauth2Application {

	public static void main(String[] args) {
		SpringApplication.run(MsvcAuthOauth2Application.class, args);
	}
}
