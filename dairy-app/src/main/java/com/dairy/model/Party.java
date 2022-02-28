package com.dairy.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "PARTY")
public class Party {

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
	
	@ManyToOne
	@JoinColumn(name = "ROUTE_ID", insertable = false, updatable = false)
	private Route route;
	
	@Column(name = "ROUTE_SEQ")
	private BigDecimal routeSeq;
	
	@Column(name = "TYPE")
	private String type;
	
	private transient String searchFlag;

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

	public void setType(String type) {
		this.type = type;
	}

	public String getSearchFlag() {
		return searchFlag;
	}

	public void setSearchFlag(String searchFlag) {
		this.searchFlag = searchFlag;
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
