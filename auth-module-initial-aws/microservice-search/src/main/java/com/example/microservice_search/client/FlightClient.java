package com.example.microservice_search.client;

import com.example.microservice_search.dto.FlightSearchResultDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

@FeignClient(name = "microservice-flight", url = "http://localhost:8085")
public interface FlightClient {

    @GetMapping("/api/flights/search")
    List<FlightSearchResultDto> searchFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date
    );
}