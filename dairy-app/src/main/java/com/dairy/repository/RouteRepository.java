package com.dairy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dairy.model.Route;
import com.dairy.model.RouteExtraInfo;

public interface RouteRepository extends JpaRepository<Route, Long> {
	
	@Query("SELECT new com.dairy.model.RouteExtraInfo("
			+"r.id as routeId, count(p.id) as Customer_Count, sum(p.defaultQuantity) as customer_Total_Quantity, "
			+ "	count(db.partyId) as customer_Delivered_Count,  sum(db.quantity) as customer_Delivered_Quantity, "
			+ "	(count(p.id)  - count(db.partyId) ) as customer_Pending_Count, (sum(p.defaultQuantity)  - sum (pdb.defaultQuantity)  ) as customer_Pending_Quantity, "
			+ " sum(pt.payment) as Payment ) "
			  + "FROM Route r "
			  + "	join Party p on p.routeId=r.id "
			  + "	left join DailyBill db on db.partyId = p.id and db.date= ?1 and db.month= ?2 "
			  + "	left join Party pdb on pdb.id=db.partyId "
			  +" 	left join Payment pt on pt.partyId=p.id and pt.date= ?1 and pt.month= ?2 and pt.type='income' and pt.category is null  "
			  + "	group by r.id ")
	List<RouteExtraInfo> getRouteExtraInfo(String date, String month);
}
