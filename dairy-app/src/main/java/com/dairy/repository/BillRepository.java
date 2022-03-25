package com.dairy.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dairy.model.Bill;

public interface BillRepository extends JpaRepository<Bill, Long> {
	
	@Query("SELECT b FROM Bill b where b.active= true and b.bill is not null and b.month = ?1 and b.type = ?2")
	List<Bill> findActiveBillForTheMonth(String month, String type);
	
	@Query("SELECT b FROM Bill b where b.active= true and b.bill is not null and b.type = ?3 "
			+ " and (?1 between b.from and b.to or ?2 between b.from and b.to )")
	List<Bill> findActiveBillForThePeriod(LocalDate from, LocalDate to, String type);
}
