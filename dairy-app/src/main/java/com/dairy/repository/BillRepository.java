package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dairy.model.Bill;

public interface BillRepository extends JpaRepository<Bill, Long> {
}
