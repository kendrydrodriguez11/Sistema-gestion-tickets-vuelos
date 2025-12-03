package com.example.microservice_aws;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

import java.util.TimeZone;

@EnableDiscoveryClient
@SpringBootApplication
public class MicroserviceAwsApplication {

	public static void main(String[] args) {

		// 🔥 Esta línea corrige el desfase de hora de la JVM
		TimeZone.setDefault(TimeZone.getTimeZone("America/Guayaquil"));

		SpringApplication.run(MicroserviceAwsApplication.class, args);
	}

	@PostConstruct
	public void printLocalTime() {
		System.out.println("Hora Local JVM: " + java.time.ZonedDateTime.now());
		System.out.println("Instant (UTC): " + java.time.Instant.now());
	}
}
