package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dairy.model.DailyBill;

public interface DailyBillRepository extends JpaRepository<DailyBill, Long> {
	
}
