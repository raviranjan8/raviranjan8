package com.dairy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dairy.model.Party;

public interface PartyRepository extends JpaRepository<Party, Long> {
	
	@Query("SELECT ti.id FROM Party ti where active= ?1")
	List<Long> findDistinctIdByActive(boolean active);
	
	@Query("SELECT p FROM Party p where p.active=true and p.routeId= ?1 and p.id not in (select partyId from DailyBill d "
			+ "where type='income' and d.month= ?2 and d.date= ?3 ) order by routeSeq")
	List<Party> findPendingCustomer(Long routeId, String month, String date);
	

	@Query("SELECT p FROM Party p where p.active=true and p.type not in ('customer') ")
	List<Party> findNonCustomerParties();
}
