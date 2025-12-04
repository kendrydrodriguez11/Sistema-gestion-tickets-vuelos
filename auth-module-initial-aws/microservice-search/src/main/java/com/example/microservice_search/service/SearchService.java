package com.example.microservice_search.service;

import com.example.microservice_search.dto.FlightSearchRequestDto;
import com.example.microservice_search.dto.FlightSearchResponseDto;

import java.util.List;

public interface SearchService {
    List<FlightSearchResponseDto> searchFlights(FlightSearchRequestDto request);
    void clearCache();
}