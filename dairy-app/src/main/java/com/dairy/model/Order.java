package com.dairy.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "ORDERS")
public class Order extends Base {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "NAME")
	private String name;

	@Column(name = "ADDRESS")
	private String address;
	
	@Column(name = "MOBILE")
	private Long mobile;
	
	@Column(name = "TOTAL_PRICE")
	private BigDecimal totalPrice;
	
	@Column(name = "TOTAL_QUANTITY")
	private BigDecimal totalQuantity;
	
	@Column(name = "ORDER_DATE")
	@JsonFormat(pattern = "dd-MMM-yyyy")
	@DateTimeFormat(pattern = "dd-MMM-yyyy")
	private LocalDate orderDate;
	
	@Column(name = "STATUS")
	private String status;
	
	@JsonManagedReference
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@Fetch(value = FetchMode.JOIN)
	@JoinColumn(name = "order_id")
	private Set<OrderDetail> orderDetails;
	

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

	public void setAddress(String address) {
		this.address = address;
	}

	public Long getMobile() {
		return mobile;
	}

	public void setMobile(Long mobile) {
		this.mobile = mobile;
	}

	public BigDecimal getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(BigDecimal totalPrice) {
		this.totalPrice = totalPrice;
	}

	public BigDecimal getTotalQuantity() {
		return totalQuantity;
	}

	public void setTotalQuantity(BigDecimal totalQuantity) {
		this.totalQuantity = totalQuantity;
	}

	public LocalDate getOrderDate() {
		return orderDate;
	}

	public void setOrderDate(LocalDate orderDate) {
		this.orderDate = orderDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Set<OrderDetail> getOrderDetails() {
		return orderDetails;
	}

	public void setOrderDetails(Set<OrderDetail> orderDetails) {
		this.orderDetails = orderDetails;
	}

	@Override
	public int hashCode() {
		return Objects.hash(address, id, mobile, name, orderDate, status, totalPrice, totalQuantity);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Order other = (Order) obj;
		return Objects.equals(address, other.address) && Objects.equals(id, other.id)
				&& Objects.equals(mobile, other.mobile) && Objects.equals(name, other.name)
				&& Objects.equals(orderDate, other.orderDate) && Objects.equals(status, other.status)
				&& Objects.equals(totalPrice, other.totalPrice) && Objects.equals(totalQuantity, other.totalQuantity);
	}

	@Override
	public String toString() {
		return "Order [id=" + id + ", name=" + name + ", address=" + address + ", mobile=" + mobile + ", totalPrice="
				+ totalPrice + ", totalQuantity=" + totalQuantity + ", orderDate=" + orderDate + ", status=" + status
				+ "]";
	}
}
