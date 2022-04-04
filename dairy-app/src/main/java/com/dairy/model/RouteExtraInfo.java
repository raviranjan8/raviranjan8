package com.dairy.model;

import java.math.BigDecimal;

public class RouteExtraInfo {
	
	private String required;
	private Long routeId;
	private Long customerCount;
	private BigDecimal customerTotalQuantity;
	private Long customerPendingCount;
	private BigDecimal customerPendingQuantity;
	private Long customerDeliveredCount;
	private BigDecimal customerDeliveredQuantity;
	private BigDecimal payment;
	
	public RouteExtraInfo() {}
	
	public RouteExtraInfo(Long routeId, Long customerCount, BigDecimal customerTotalQuantity,  Long customerDeliveredCount, BigDecimal customerDeliveredQuantity,
			Long customerPendingCount, BigDecimal customerPendingQuantity , BigDecimal payment) {
		super();
		this.routeId = routeId;
		this.customerCount = customerCount;
		this.customerTotalQuantity = customerTotalQuantity;
		this.customerPendingCount = customerPendingCount;
		this.customerPendingQuantity = customerPendingQuantity;
		this.customerDeliveredCount = customerDeliveredCount;
		this.customerDeliveredQuantity = customerDeliveredQuantity;
		this.payment = payment;
	}

	public Long getRouteId() {
		return routeId;
	}
	public void setRouteId(Long routeId) {
		this.routeId = routeId;
	}
	public String getRequired() {
		return required;
	}
	public void setRequired(String required) {
		this.required = required;
	}
	public Long getCustomerCount() {
		return customerCount;
	}
	public void setCustomerCount(Long customerCount) {
		this.customerCount = customerCount;
	}
	
	public Long getCustomerDeliveredCount() {
		return customerDeliveredCount;
	}
	public void setCustomerDeliveredCount(Long customerDeliveredCount) {
		this.customerDeliveredCount = customerDeliveredCount;
	}


	public BigDecimal getCustomerTotalQuantity() {
		return customerTotalQuantity;
	}


	public void setCustomerTotalQuantity(BigDecimal customerTotalQuantity) {
		this.customerTotalQuantity = customerTotalQuantity;
	}


	public Long getCustomerPendingCount() {
		return customerPendingCount;
	}


	public void setCustomerPendingCount(Long customerPendingCount) {
		this.customerPendingCount = customerPendingCount;
	}


	public BigDecimal getCustomerPendingQuantity() {
		return customerPendingQuantity;
	}


	public void setCustomerPendingQuantity(BigDecimal customerPendingQuantity) {
		this.customerPendingQuantity = customerPendingQuantity;
	}


	public BigDecimal getCustomerDeliveredQuantity() {
		return customerDeliveredQuantity;
	}


	public void setCustomerDeliveredQuantity(BigDecimal customerDeliveredQuantity) {
		this.customerDeliveredQuantity = customerDeliveredQuantity;
	}
	
	public BigDecimal getPayment() {
		return payment;
	}

	public void setPayment(BigDecimal payment) {
		this.payment = payment;
	}

	@Override
	public String toString() {
		return "RouteExtraInfo [required=" + required + ", routeId=" + routeId + ", customerCount=" + customerCount
				+ ", customerTotalQuantity=" + customerTotalQuantity + ", customerPendingCount=" + customerPendingCount
				+ ", customerPendingQuantity=" + customerPendingQuantity + ", customerDeliveredCount="
				+ customerDeliveredCount + ", customerDeliveredQuantity=" + customerDeliveredQuantity + "]";
	}
	
}
