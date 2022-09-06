package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.dairy.model.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
	
	@Transactional
	@Modifying
	@Query("update Order p set p.status= ?1 where p.id= ?2")
	int updateMobile(String status, Long id);
}
