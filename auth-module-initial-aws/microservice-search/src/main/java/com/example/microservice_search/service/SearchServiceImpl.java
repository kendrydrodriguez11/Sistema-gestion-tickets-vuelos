package com.example.microservice_search.service;

import com.example.microservice_search.client.FlightClient;
import com.example.microservice_search.client.PricingClient;
import com.example.microservice_search.dto.FlightPriceDto;
import com.example.microservice_search.dto.FlightSearchRequestDto;
import com.example.microservice_search.dto.FlightSearchResponseDto;
import com.example.microservice_search.dto.FlightSearchResultDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class SearchServiceImpl implements SearchService {

    private final FlightClient flightClient;
    private final PricingClient pricingClient;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final Duration CACHE_TTL = Duration.ofMinutes(5);

    @Override
    public List<FlightSearchResponseDto> searchFlights(FlightSearchRequestDto request) {
        String cacheKey = buildCacheKey(request);

        @SuppressWarnings("unchecked")
        List<FlightSearchResponseDto> cached = (List<FlightSearchResponseDto>) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            log.info("Cache hit for search: {}", cacheKey);
            return cached;
        }

        log.info("Cache miss - Fetching fresh data for: {}", cacheKey);

        LocalDateTime searchDateTime = request.getDepartureDate().atStartOfDay();
        List<FlightSearchResultDto> flights = flightClient.searchFlights(
                request.getOrigin(),
                request.getDestination(),
                searchDateTime
        );

        List<FlightSearchResponseDto> results = flights.stream()
                .map(this::enrichWithPricing)
                .filter(flight -> flight.getAvailableSeats() >= request.getPassengers())
                .sorted((a, b) -> a.getCurrentPrice().compareTo(b.getCurrentPrice()))
                .collect(Collectors.toList());

        redisTemplate.opsForValue().set(cacheKey, results, CACHE_TTL);
        log.info("Cached {} flights for key: {}", results.size(), cacheKey);

        return results;
    }

    @Override
    public void clearCache() {
        redisTemplate.keys("flight:search:*").forEach(key -> redisTemplate.delete(key));
        log.info("Search cache cleared");
    }

    private FlightSearchResponseDto enrichWithPricing(FlightSearchResultDto flight) {
        FlightPriceDto priceInfo = null;

        try {
            priceInfo = pricingClient.calculatePrice(
                    flight.getId(),
                    flight.getBasePrice(),
                    flight.getOccupancyRate(),
                    flight.getDepartureTime()
            );
            log.debug("Price calculated for flight {}: {}", flight.getFlightNumber(), priceInfo.getCurrentPrice());
        } catch (Exception e) {
            log.error("Error calculating price for flight {}: {}", flight.getId(), e.getMessage());
        }

        return FlightSearchResponseDto.builder()
                .flightId(flight.getId())
                .flightNumber(flight.getFlightNumber())
                .originAirport(flight.getRoute().getOriginAirport())
                .destinationAirport(flight.getRoute().getDestinationAirport())
                .originCity(flight.getRoute().getOriginCity())
                .destinationCity(flight.getRoute().getDestinationCity())
                .departureTime(flight.getDepartureTime())
                .arrivalTime(flight.getArrivalTime())
                .durationMinutes(flight.getRoute().getEstimatedDurationMinutes())
                .basePrice(flight.getBasePrice())
                .currentPrice(priceInfo != null ? priceInfo.getCurrentPrice() : flight.getBasePrice())
                .priceLevel(priceInfo != null ? priceInfo.getPriceLevel() : "UNKNOWN")
                .availableSeats(flight.getAvailableSeats())
                .totalSeats(flight.getAircraft().getTotalSeats())
                .occupancyRate(flight.getOccupancyRate())
                .aircraftModel(flight.getAircraft().getModel())
                .aircraftManufacturer(flight.getAircraft().getManufacturer())
                .build();
    }

    private String buildCacheKey(FlightSearchRequestDto request) {
        return String.format("flight:search:%s:%s:%s:%d",
                request.getOrigin(),
                request.getDestination(),
                request.getDepartureDate(),
                request.getPassengers());
    }
}
