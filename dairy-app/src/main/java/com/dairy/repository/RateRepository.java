package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dairy.model.Rate;

public interface RateRepository extends JpaRepository<Rate, Long> {
}
