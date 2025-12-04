package com.example.microservice_change.dto;

import com.example.microservice_change.model.DenominationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO de detalle de una denominación en la respuesta de vuelto.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DenominationDetailDto {

    private UUID denominationId;
    private BigDecimal value;
    private DenominationType type;
    private Integer quantity;      // Cantidad de esta denominación en el vuelto
    private BigDecimal subtotal;   // value * quantity
}