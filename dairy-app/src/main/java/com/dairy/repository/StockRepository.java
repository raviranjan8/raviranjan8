package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dairy.model.Stock;

public interface StockRepository extends JpaRepository<Stock, Long> {
}
