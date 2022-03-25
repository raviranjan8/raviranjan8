package com.dairy.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dairy.model.DailyBill;

public interface DailyBillRepository extends JpaRepository<DailyBill, Long> {
	
	
	@Query("SELECT b FROM DailyBill b where b.type = ?3 "
			+ " and deliveryDate between ?1 and ?2 ")
	List<DailyBill> findActiveBillForThePeriod(LocalDate from, LocalDate to, String type);
	
}
