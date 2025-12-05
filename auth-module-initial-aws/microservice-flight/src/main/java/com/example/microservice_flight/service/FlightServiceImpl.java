package com.example.microservice_flight.service;

import com.example.microservice_flight.dto.*;
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

        // Verificar si ya existe un vuelo con ese número en fecha similar
        flightRepository.findByFlightNumber(dto.getFlightNumber())
                .ifPresent(existing -> {
                    if (existing.getDepartureTime().toLocalDate().equals(dto.getDepartureTime().toLocalDate())) {
                        throw new RuntimeException("Flight with this number already exists for this date");
                    }
                });

        AircraftEntity aircraft = aircraftRepository.findById(dto.getAircraftId())
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));

        if (aircraft.getStatus() != AircraftStatus.ACTIVE) {
            throw new RuntimeException("Aircraft is not active");
        }

        RouteEntity route = routeRepository.findById(dto.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        if (route.getStatus() != RouteStatus.ACTIVE) {
            throw new RuntimeException("Route is not active");
        }

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

        log.info("Flight created successfully: {} with {} seats", saved.getId(), aircraft.getTotalSeats());
        return mapToDto(saved, true);
    }

    @Override
    @Transactional
    public FlightDto updateFlight(UUID id, FlightDto dto) {
        FlightEntity flight = flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (dto.getDepartureTime() != null) {
            // No permitir cambiar horario si hay reservas confirmadas
            if (flight.getBookedSeats() > 0) {
                throw new RuntimeException("Cannot change departure time for flight with bookings");
            }
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

        List<FlightEntity> flights = flightRepository.searchFlights(origin, destination, startDate, endDate);

        return flights.stream()
                .filter(f -> f.getAvailableSeats() > 0) // Solo vuelos con asientos disponibles
                .map(f -> mapToDto(f, true))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void generateSeatsForFlight(UUID flightId) {
        FlightEntity flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        if (!seatRepository.findByFlightId(flightId).isEmpty()) {
            log.warn("Flight {} already has seats generated", flightId);
            return;
        }

        AircraftEntity aircraft = flight.getAircraft();
        List<SeatEntity> seats = new ArrayList<>();

        int firstClassSeats = aircraft.getFirstClassSeats() != null ? aircraft.getFirstClassSeats() : 0;
        int businessSeats = aircraft.getBusinessSeats() != null ? aircraft.getBusinessSeats() : 0;
        int economySeats = aircraft.getEconomySeats() != null ? aircraft.getEconomySeats() : 0;

        if (firstClassSeats > 0) {
            char[] firstColumns = {'A', 'B', 'C', 'D'};
            int firstRows = (int) Math.ceil(firstClassSeats / 4.0);

            for (int row = 1; row <= firstRows && seats.size() < firstClassSeats; row++) {
                for (char col : firstColumns) {
                    if (seats.size() >= firstClassSeats) break;
                    seats.add(createSeat(flight, row + String.valueOf(col), SeatClass.FIRST_CLASS));
                }
            }
        }

        if (businessSeats > 0) {
            char[] businessColumns = {'A', 'B', 'C', 'D', 'E', 'F'};
            int startRow = (int) Math.ceil(firstClassSeats / 4.0) + 1;
            int businessRows = (int) Math.ceil(businessSeats / 6.0);

            for (int row = startRow; row < startRow + businessRows && (seats.size() - firstClassSeats) < businessSeats; row++) {
                for (char col : businessColumns) {
                    if ((seats.size() - firstClassSeats) >= businessSeats) break;
                    seats.add(createSeat(flight, row + String.valueOf(col), SeatClass.BUSINESS));
                }
            }
        }

        if (economySeats > 0) {
            char[] economyColumns = {'A', 'B', 'C', 'D', 'E', 'F'};
            int startRow = (int) Math.ceil(firstClassSeats / 4.0) + (int) Math.ceil(businessSeats / 6.0) + 1;
            int economyRows = (int) Math.ceil(economySeats / 6.0);

            for (int row = startRow; row < startRow + economyRows && (seats.size() - firstClassSeats - businessSeats) < economySeats; row++) {
                for (char col : economyColumns) {
                    if ((seats.size() - firstClassSeats - businessSeats) >= economySeats) break;
                    seats.add(createSeat(flight, row + String.valueOf(col), SeatClass.ECONOMY));
                }
            }
        }

        if (seats.isEmpty()) {
            throw new RuntimeException("No seats were generated for flight " + flightId);
        }

        seatRepository.saveAll(seats);
        log.info("Generated {} seats for flight {}", seats.size(), flightId);
    }


    private SeatEntity createSeat(FlightEntity flight, String seatNumber, SeatClass seatClass) {
        return SeatEntity.builder()
                .flight(flight)
                .seatNumber(seatNumber)
                .seatClass(seatClass)
                .status(SeatStatus.AVAILABLE)
                .build();
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