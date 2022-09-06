package com.dairy.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedEntityGraph;
import javax.persistence.NamedEntityGraphs;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "PARTY", 
uniqueConstraints = { 
  @UniqueConstraint(columnNames = "MOB_NO"),
  @UniqueConstraint(columnNames = "type") 
})
@NamedEntityGraphs({
    @NamedEntityGraph(name="all",includeAllAttributes = true
    ),
    @NamedEntityGraph(name="none", includeAllAttributes = false
    )
})
public class Party extends Base {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "NAME")
	private String name;

	@Column(name = "ADDRESS")
	private String address;
	
	@Column(name = "MOB_NO")
	private Long mobNo;

	@JsonFormat(pattern = "dd-MMM-yyyy")
	@Column(name = "START_DATE")
	private Date startDate;
	
	@JsonFormat(pattern = "dd-MMM-yyyy")
	@Column(name = "END_DATE")
	private Date endDate;
	
	@Column(name = "DAILY_QUANTITY")
	private BigDecimal defaultQuantity;
	
	@Column(name = "ACTIVE")
	private Boolean active;
	
	@Column(name = "ROUTE_ID")
	private Long routeId;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@ManyToOne
	@Fetch(value = FetchMode.JOIN)
	@JoinColumn(name = "ROUTE_ID", insertable = false, updatable = false)
	private Route route;
	
	@OneToMany
	@JoinColumn(name = "party_id" , insertable = false, updatable = false)
	private Set<DailyBill> dailyBills;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "party_id" , insertable = false, updatable = false)
	private Set<Bill> bills;
	
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "party_id" , insertable = false, updatable = false)
	private Set<Bill> prevBills;
	
	//@JsonManagedReference
	@OneToMany(fetch = FetchType.LAZY)
	@JoinColumn(name = "party_id" , insertable = false, updatable = false)
	private Set<Payment> payments;
	
	@Column(name = "ROUTE_SEQ")
	private BigDecimal routeSeq;
	
	@Column(name = "TYPE")
	private String type;
	
	@Column(name = "USER_TYPE")
	private String userType;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAddress() {
		return address;
	}
	
	public Long getMobNo() {
		return mobNo;
	}

	public void setMobNo(Long mobNo) {
		this.mobNo = mobNo;
	}


	public void setAddress(String address) {
		this.address = address;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public BigDecimal getDefaultQuantity() {
		return defaultQuantity;
	}

	public void setDefaultQuantity(BigDecimal defaultQuantity) {
		this.defaultQuantity = defaultQuantity;
	}

	public Boolean isActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Long getRouteId() {
		return routeId;
	}

	public void setRouteId(Long routeId) {
		this.routeId = routeId;
	}

	public BigDecimal getRouteSeq() {
		return routeSeq;
	}

	public void setRouteSeq(BigDecimal routeSeq) {
		this.routeSeq = routeSeq;
	}

	public Route getRoute() {
		return route;
	}

	public void setRoute(Route route) {
		this.route = route;
	}

	public Boolean getActive() {
		return active;
	}

	public String getType() {
		return type;
	}
	
	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Set<DailyBill> getDailyBills() {
		   return dailyBills;
	}

	public void setDailyBills(Set<DailyBill> dailyBills) {
		this.dailyBills = dailyBills;
	}
	
	public Set<Bill> getPrevBills() {
		return prevBills;
	}

	public void setPrevBills(Set<Bill> prevBills) {
		this.prevBills = prevBills;
	}

	public Set<Bill> getBills() {
		return bills;
	}

	public void setBills(Set<Bill> bills) {
		this.bills = bills;
	}

	public Set<Payment> getPayments() {
		return payments;
	}

	public void setPayments(Set<Payment> payments) {
		this.payments = payments;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + (active ? 1231 : 1237);
		result = prime * result + ((address == null) ? 0 : address.hashCode());
		result = prime * result + ((defaultQuantity == null) ? 0 : defaultQuantity.hashCode());
		result = prime * result + ((endDate == null) ? 0 : endDate.hashCode());
		result = prime * result + (int) (id ^ (id >>> 32));
		result = prime * result + ((name == null) ? 0 : name.hashCode());
		result = prime * result + (int) (routeId ^ (routeId >>> 32));
		result = prime * result + ((routeSeq == null) ? 0 : routeSeq.hashCode());
		result = prime * result + ((startDate == null) ? 0 : startDate.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Party other = (Party) obj;
		if (active != other.active)
			return false;
		if (address == null) {
			if (other.address != null)
				return false;
		} else if (!address.equals(other.address))
			return false;
		if (defaultQuantity == null) {
			if (other.defaultQuantity != null)
				return false;
		} else if (!defaultQuantity.equals(other.defaultQuantity))
			return false;
		if (endDate == null) {
			if (other.endDate != null)
				return false;
		} else if (!endDate.equals(other.endDate))
			return false;
		if (id != other.id)
			return false;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
		if (routeId != other.routeId)
			return false;
		if (routeSeq == null) {
			if (other.routeSeq != null)
				return false;
		} else if (!routeSeq.equals(other.routeSeq))
			return false;
		if (startDate == null) {
			if (other.startDate != null)
				return false;
		} else if (!startDate.equals(other.startDate))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Customer [id=" + id + ", name=" + name + ", address=" + address + ", startDate=" + startDate
				+ ", endDate=" + endDate + ", defaultQuantity=" + defaultQuantity + ", active=" + active + ", routeId="
				+ routeId + ", routeSeq=" + routeSeq + "]";
	}
}
