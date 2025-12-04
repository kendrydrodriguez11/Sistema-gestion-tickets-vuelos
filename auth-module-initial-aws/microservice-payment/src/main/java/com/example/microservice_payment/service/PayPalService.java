package com.example.microservice_payment.service;

import com.example.microservice_payment.dto.PayPalOrderDto;
import com.paypal.core.PayPalHttpClient;
import com.paypal.http.HttpResponse;
import com.paypal.orders.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class PayPalService {

    private final PayPalHttpClient payPalHttpClient;

    /**
     * Crea una orden de pago en PayPal
     */
    public PayPalOrderDto createOrder(BigDecimal amount, String currency, String returnUrl, String cancelUrl) {
        try {
            OrderRequest orderRequest = new OrderRequest();
            orderRequest.checkoutPaymentIntent("CAPTURE");

            // Application context
            ApplicationContext applicationContext = new ApplicationContext()
                    .returnUrl(returnUrl)
                    .cancelUrl(cancelUrl)
                    .brandName("Flight Booking System")
                    .landingPage("BILLING")
                    .userAction("PAY_NOW");

            orderRequest.applicationContext(applicationContext);

            // Purchase units
            List<PurchaseUnitRequest> purchaseUnits = new ArrayList<>();
            PurchaseUnitRequest purchaseUnit = new PurchaseUnitRequest()
                    .description("Flight Booking Payment")
                    .amountWithBreakdown(new AmountWithBreakdown()
                            .currencyCode(currency)
                            .value(amount.toString()));

            purchaseUnits.add(purchaseUnit);
            orderRequest.purchaseUnits(purchaseUnits);

            // Create order request
            OrdersCreateRequest request = new OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody(orderRequest);

            HttpResponse<Order> response = payPalHttpClient.execute(request);
            Order order = response.result();

            log.info("PayPal order created: {}", order.id());

            // Extraer approval URL
            String approvalUrl = order.links().stream()
                    .filter(link -> "approve".equals(link.rel()))
                    .findFirst()
                    .map(LinkDescription::href)
                    .orElse(null);

            return PayPalOrderDto.builder()
                    .id(order.id())
                    .status(order.status())
                    .approvalUrl(approvalUrl)
                    .build();

        } catch (IOException e) {
            log.error("Error creating PayPal order: {}", e.getMessage());
            throw new RuntimeException("Failed to create PayPal order", e);
        }
    }

    /**
     * Captura un pago después de la aprobación del usuario
     */
    public Order captureOrder(String orderId) {
        try {
            OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
            request.prefer("return=representation");

            HttpResponse<Order> response = payPalHttpClient.execute(request);
            Order order = response.result();

            log.info("PayPal order captured: {}", order.id());
            return order;

        } catch (IOException e) {
            log.error("Error capturing PayPal order: {}", e.getMessage());
            throw new RuntimeException("Failed to capture PayPal order", e);
        }
    }

    /**
     * Obtiene detalles de una orden
     */
    public Order getOrderDetails(String orderId) {
        try {
            OrdersGetRequest request = new OrdersGetRequest(orderId);
            HttpResponse<Order> response = payPalHttpClient.execute(request);
            return response.result();
        } catch (IOException e) {
            log.error("Error getting PayPal order details: {}", e.getMessage());
            throw new RuntimeException("Failed to get PayPal order details", e);
        }
    }
}