package com.example.microservice_search.controller;

import com.example.microservice_search.dto.FlightSearchRequestDto;
import com.example.microservice_search.dto.FlightSearchResponseDto;
import com.example.microservice_search.service.SearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    @PostMapping("/flights")
    public ResponseEntity<List<FlightSearchResponseDto>> searchFlights(
            @Valid @RequestBody FlightSearchRequestDto request) {
        log.info("Flight search: {} to {} on {}",
                request.getOrigin(), request.getDestination(), request.getDepartureDate());
        return ResponseEntity.ok(searchService.searchFlights(request));
    }

    @GetMapping("/flights")
    public ResponseEntity<List<FlightSearchResponseDto>> searchFlightsGet(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate returnDate,
            @RequestParam(defaultValue = "1") Integer passengers) {

        FlightSearchRequestDto request = FlightSearchRequestDto.builder()
                .origin(origin)
                .destination(destination)
                .departureDate(departureDate)
                .returnDate(returnDate)
                .passengers(passengers)
                .build();

        return ResponseEntity.ok(searchService.searchFlights(request));
    }

    @DeleteMapping("/cache")
    public ResponseEntity<Void> clearCache() {
        searchService.clearCache();
        return ResponseEntity.noContent().build();
    }
}