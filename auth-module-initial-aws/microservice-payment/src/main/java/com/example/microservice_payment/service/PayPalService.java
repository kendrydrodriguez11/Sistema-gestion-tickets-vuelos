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

    public PayPalOrderDto createOrder(BigDecimal amount, String currency, String returnUrl, String cancelUrl) {
        try {
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalArgumentException("Amount must be greater than zero");
            }
            if (currency == null || currency.isBlank()) {
                currency = "USD";
            }

            OrderRequest orderRequest = new OrderRequest();
            orderRequest.checkoutPaymentIntent("CAPTURE");

            ApplicationContext applicationContext = new ApplicationContext()
                    .returnUrl(returnUrl != null ? returnUrl : "http://localhost:3000/payment/success")
                    .cancelUrl(cancelUrl != null ? cancelUrl : "http://localhost:3000/payment/cancel")
                    .brandName("Flight Booking System")
                    .landingPage("BILLING")
                    .userAction("PAY_NOW")
                    .shippingPreference("NO_SHIPPING");

            orderRequest.applicationContext(applicationContext);

            List<PurchaseUnitRequest> purchaseUnits = new ArrayList<>();
            PurchaseUnitRequest purchaseUnit = new PurchaseUnitRequest()
                    .referenceId("FLIGHT_BOOKING")
                    .description("Flight Booking Payment")
                    .customId("flight-booking")
                    .softDescriptor("FLIGHT BOOKING")
                    .amountWithBreakdown(new AmountWithBreakdown()
                            .currencyCode(currency)
                            .value(amount.toString()));

            purchaseUnits.add(purchaseUnit);
            orderRequest.purchaseUnits(purchaseUnits);

            OrdersCreateRequest request = new OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody(orderRequest);

            HttpResponse<Order> response = payPalHttpClient.execute(request);
            Order order = response.result();

            String approvalUrl = order.links().stream()
                    .filter(link -> "approve".equals(link.rel()))
                    .findFirst()
                    .map(LinkDescription::href)
                    .orElseThrow(() -> new RuntimeException("No approval URL found in PayPal response"));

            return PayPalOrderDto.builder()
                    .id(order.id())
                    .status(order.status())
                    .approvalUrl(approvalUrl)
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Failed to create PayPal order: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error: " + e.getMessage(), e);
        }
    }

    public Order captureOrder(String orderId) {
        try {
            if (orderId == null || orderId.isBlank()) {
                throw new IllegalArgumentException("Order ID cannot be null or empty");
            }

            OrdersCaptureRequest request = new OrdersCaptureRequest(orderId);
            request.prefer("return=representation");

            HttpResponse<Order> response = payPalHttpClient.execute(request);
            Order order = response.result();

            if (!"COMPLETED".equals(order.status())) {
                log.warn("PayPal order not completed. Status: {}", order.status());
            }

            return order;

        } catch (IOException e) {
            throw new RuntimeException("Failed to capture PayPal order: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error: " + e.getMessage(), e);
        }
    }

    public Order getOrderDetails(String orderId) {
        try {
            if (orderId == null || orderId.isBlank()) {
                throw new IllegalArgumentException("Order ID cannot be null or empty");
            }

            OrdersGetRequest request = new OrdersGetRequest(orderId);
            HttpResponse<Order> response = payPalHttpClient.execute(request);
            return response.result();

        } catch (IOException e) {
            throw new RuntimeException("Failed to get PayPal order details: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error: " + e.getMessage(), e);
        }
    }

    public boolean refundPayment(String captureId, BigDecimal amount, String currency) {
        try {
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
