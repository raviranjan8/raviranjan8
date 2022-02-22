package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dairy.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
