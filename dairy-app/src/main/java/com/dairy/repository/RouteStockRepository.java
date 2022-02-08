package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dairy.model.RouteStock;

public interface RouteStockRepository extends JpaRepository<RouteStock, Long> {
}
