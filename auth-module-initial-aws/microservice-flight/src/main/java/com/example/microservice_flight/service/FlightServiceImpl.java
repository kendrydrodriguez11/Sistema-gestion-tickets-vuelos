package com.example.microservice_flight.service;

import com.example.microservice_flight.dto.AircraftDto;
import com.example.microservice_flight.dto.FlightDto;
import com.example.microservice_flight.dto.RouteDto;
import com.example.microservice_flight.dto.SeatDto;
import com.example.microservice_flight.model.*;
import com.example.microservice_flight.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class FlightServiceImpl implements FlightService {

    private final FlightRepository flightRepository;
    private final AircraftRepository aircraftRepository;
    private final RouteRepository routeRepository;
    private final SeatRepository seatRepository;

    @Override
    @Transactional
    public FlightDto createFlight(FlightDto dto) {
        log.info("Creating flight: {}", dto.getFlightNumber());

        AircraftEntity aircraft = aircraftRepository.findById(dto.getAircraftId())
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));

        RouteEntity route = routeRepository.findById(dto.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        FlightEntity flight = FlightEntity.builder()
                .flightNumber(dto.getFlightNumber())
                .aircraft(aircraft)
                .route(route)
                .departureTime(dto.getDepartureTime())
                .arrivalTime(dto.getArrivalTime())
                .basePrice(dto.getBasePrice())
                .availableSeats(aircraft.getTotalSeats())
                .bookedSeats(0)
                .status(FlightStatus.SCHEDULED)
                .build();

        FlightEntity saved = flightRepository.save(flight);

        // Generar asientos automáticamente
        generateSeatsForFlight(saved.getId());

        log.info("Flight created successfully: {}", saved.getId());
        return mapToDto(saved, true);
    }

    @Override
    @Transactional
    public FlightDto updateFlight(UUID id, FlightDto dto) {
        FlightEntity flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (dto.getDepartureTime() != null) {
            flight.setDepartureTime(dto.getDepartureTime());
        }
        if (dto.getArrivalTime() != null) {
            flight.setArrivalTime(dto.getArrivalTime());
        }
        if (dto.getBasePrice() != null) {
            flight.setBasePrice(dto.getBasePrice());
        }
        if (dto.getStatus() != null) {
            flight.setStatus(dto.getStatus());
        }

        FlightEntity updated = flightRepository.save(flight);
        return mapToDto(updated, true);
    }

    @Override
    @Transactional(readOnly = true)
    public FlightDto getFlight(UUID id) {
        FlightEntity flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        return mapToDto(flight, true);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FlightDto> getAllFlights(Pageable pageable) {
        return flightRepository.findAll(pageable)
                .map(f -> mapToDto(f, false));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlightDto> searchFlights(String origin, String destination, LocalDateTime date) {
        LocalDateTime startDate = date.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endDate = date.withHour(23).withMinute(59).withSecond(59);

        return flightRepository.searchFlights(origin, destination, startDate, endDate)
                .stream()
                .map(f -> mapToDto(f, true))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void generateSeatsForFlight(UUID flightId) {
        FlightEntity flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        AircraftEntity aircraft = flight.getAircraft();
        List<SeatEntity> seats = new ArrayList<>();

        // Generar asientos Economy
        int economyRows = (int) Math.ceil(aircraft.getEconomySeats() / 6.0);
        char[] columns = {'A', 'B', 'C', 'D', 'E', 'F'};

        for (int row = 1; row <= economyRows; row++) {
            for (char col : columns) {
                if (seats.size() >= aircraft.getEconomySeats()) break;
                seats.add(SeatEntity.builder()
                        .flight(flight)
                        .seatNumber(row + String.valueOf(col))
                        .seatClass(SeatClass.ECONOMY)
                        .status(SeatStatus.AVAILABLE)
                        .build());
            }
        }

        // Generar asientos Business
        int businessRows = (int) Math.ceil(aircraft.getBusinessSeats() / 4.0);
        char[] businessColumns = {'A', 'B', 'C', 'D'};
        int startRow = economyRows + 1;

        for (int row = startRow; row < startRow + businessRows; row++) {
            for (char col : businessColumns) {
                if (seats.size() >= aircraft.getEconomySeats() + aircraft.getBusinessSeats()) break;
                seats.add(SeatEntity.builder()
                        .flight(flight)
                        .seatNumber(row + String.valueOf(col))
                        .seatClass(SeatClass.BUSINESS)
                        .status(SeatStatus.AVAILABLE)
                        .build());
            }
        }

        // Generar asientos First Class
        int firstClassRows = (int) Math.ceil(aircraft.getFirstClassSeats() / 2.0);
        char[] firstColumns = {'A', 'B'};
        startRow = economyRows + businessRows + 1;

        for (int row = startRow; row < startRow + firstClassRows; row++) {
            for (char col : firstColumns) {
                if (seats.size() >= aircraft.getTotalSeats()) break;
                seats.add(SeatEntity.builder()
                        .flight(flight)
                        .seatNumber(row + String.valueOf(col))
                        .seatClass(SeatClass.FIRST_CLASS)
                        .status(SeatStatus.AVAILABLE)
                        .build());
            }
        }

        seatRepository.saveAll(seats);
        log.info("Generated {} seats for flight {}", seats.size(), flightId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SeatDto> getAvailableSeats(UUID flightId) {
        return seatRepository.findByFlightIdAndStatus(flightId, SeatStatus.AVAILABLE)
                .stream()
                .map(this::mapSeatToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public boolean reserveSeat(UUID flightId, String seatNumber, UUID bookingId) {
        SeatEntity seat = seatRepository.findByFlightIdAndSeatNumber(flightId, seatNumber)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (seat.getStatus() != SeatStatus.AVAILABLE) {
            log.warn("Seat {} is not available for flight {}", seatNumber, flightId);
            return false;
        }

        seat.setStatus(SeatStatus.RESERVED);
        seat.setReservedByBookingId(bookingId);
        seat.setReservedAt(LocalDateTime.now());
        seatRepository.save(seat);

        updateFlightOccupancy(flightId);

        log.info("Seat {} reserved for booking {}", seatNumber, bookingId);
        return true;
    }

    @Override
    @Transactional
    public void releaseSeat(UUID flightId, String seatNumber) {
        SeatEntity seat = seatRepository.findByFlightIdAndSeatNumber(flightId, seatNumber)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        seat.setStatus(SeatStatus.AVAILABLE);
        seat.setReservedByBookingId(null);
        seat.setReservedAt(null);
        seatRepository.save(seat);

        updateFlightOccupancy(flightId);

        log.info("Seat {} released for flight {}", seatNumber, flightId);
    }

    @Override
    @Transactional
    public void updateFlightOccupancy(UUID flightId) {
        FlightEntity flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        Integer available = seatRepository.countAvailableSeats(flightId);
        flight.setAvailableSeats(available);
        flight.setBookedSeats(flight.getAircraft().getTotalSeats() - available);

        flightRepository.save(flight);
        log.debug("Updated occupancy for flight {}: {} booked, {} available",
                flightId, flight.getBookedSeats(), flight.getAvailableSeats());
    }

    private FlightDto mapToDto(FlightEntity entity, boolean includeRelations) {
        FlightDto dto = FlightDto.builder()
                .id(entity.getId())
                .flightNumber(entity.getFlightNumber())
                .aircraftId(entity.getAircraft().getId())
                .routeId(entity.getRoute().getId())
                .departureTime(entity.getDepartureTime())
                .arrivalTime(entity.getArrivalTime())
                .basePrice(entity.getBasePrice())
                .availableSeats(entity.getAvailableSeats())
                .bookedSeats(entity.getBookedSeats())
                .status(entity.getStatus())
                .occupancyRate(entity.getOccupancyRate())
                .build();

        if (includeRelations) {
            dto.setAircraft(mapAircraftToDto(entity.getAircraft()));
            dto.setRoute(mapRouteToDto(entity.getRoute()));
        }

        return dto;
    }

    private AircraftDto mapAircraftToDto(AircraftEntity entity) {
        return AircraftDto.builder()
                .id(entity.getId())
                .registrationNumber(entity.getRegistrationNumber())
                .model(entity.getModel())
                .manufacturer(entity.getManufacturer())
                .totalSeats(entity.getTotalSeats())
                .economySeats(entity.getEconomySeats())
                .businessSeats(entity.getBusinessSeats())
                .firstClassSeats(entity.getFirstClassSeats())
                .status(entity.getStatus())
                .yearManufactured(entity.getYearManufactured())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    private RouteDto mapRouteToDto(RouteEntity entity) {
        return RouteDto.builder()
                .id(entity.getId())
                .originAirport(entity.getOriginAirport())
                .destinationAirport(entity.getDestinationAirport())
                .originCity(entity.getOriginCity())
                .destinationCity(entity.getDestinationCity())
                .originCountry(entity.getOriginCountry())
                .destinationCountry(entity.getDestinationCountry())
                .distanceKm(entity.getDistanceKm())
                .estimatedDurationMinutes(entity.getEstimatedDurationMinutes())
                .status(entity.getStatus())
                .build();
    }

    private SeatDto mapSeatToDto(SeatEntity entity) {
        return SeatDto.builder()
                .id(entity.getId())
                .flightId(entity.getFlight().getId())
                .seatNumber(entity.getSeatNumber())
                .seatClass(entity.getSeatClass())
                .status(entity.getStatus())
                .reservedByBookingId(entity.getReservedByBookingId())
                .reservedAt(entity.getReservedAt())
                .build();
    }
}