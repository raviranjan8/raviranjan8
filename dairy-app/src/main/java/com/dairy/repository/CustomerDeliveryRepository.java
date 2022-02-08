package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dairy.model.CustomerDelivery;

public interface CustomerDeliveryRepository extends JpaRepository<CustomerDelivery, Long> {
}
