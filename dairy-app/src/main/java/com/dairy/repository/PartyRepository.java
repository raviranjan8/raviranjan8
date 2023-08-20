package com.dairy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.EntityGraph.EntityGraphType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.dairy.model.Party;

public interface PartyRepository extends JpaRepository<Party, Long> {
	
	@Query("SELECT p FROM Party p where active= ?1 and p.type not in ( 'farmer') ")
	List<Party> findDistinctIdByActive(boolean active);
	
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
	
	@EntityGraph(value = "all" , type=EntityGraphType.FETCH)
	@Query("select distinct p from Party p "
			+ "	left join p.dailyBills db on db.month= ?1 and db.type = 'income' "
			+ "	left join p.bills b  on b.month=?1 and b.type = 'income' and b.active=true "
			+ "	left join p.prevBills b2 on b2.month=?2 and b2.type = 'income' and b2.active=true "
			+ "	left join p.payments pt on pt.month=?1 and pt.active=true and pt.type = 'income' "
			+ " where p.type = 'customer' ")
	List<Party> getPartyCalendarInfo(String month, String prevMonth);
}
