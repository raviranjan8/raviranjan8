package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dairy.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
