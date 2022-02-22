package com.dairy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dairy.model.Bill;

public interface BillRepository extends JpaRepository<Bill, Long> {
	
	@Query("SELECT b FROM Bill b where b.active= true and b.bill is not null and b.month = ?1 and b.type = ?2")
	List<Bill> findActiveBillForTheMonth(String month, String type);
}
