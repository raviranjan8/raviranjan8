package com.dairy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.dairy.model.Party;

public interface PartyRepository extends JpaRepository<Party, Long> {
	
	@Query("SELECT p.id FROM Party p where active= ?1 and p.type not in ( 'farmer') ")
	List<Long> findDistinctIdByActive(boolean active);
	
	@Query("SELECT p.id FROM Party p where active= ?1 and p.type in ( 'farmer') ")
	List<Long> findDistinctFarmersIdByActive(boolean active);
	
	@Query("SELECT p FROM Party p where p.active=true and p.routeId= ?1 and p.id not in (select partyId from DailyBill d "
			+ "where type='income' and d.month= ?2 and d.date= ?3 ) order by routeSeq")
	List<Party> findPendingCustomer(Long routeId, String month, String date);
	

	@Query("SELECT p FROM Party p where p.active=true and p.type not in ('customer', 'farmer') ")
	List<Party> findNonCustomerParties();
	
	@Transactional
	@Modifying
	@Query("update Party p set p.mobNo= ?1 where p.id= ?2")
	int updateMobile(Long mobileNo, Long id);
}
