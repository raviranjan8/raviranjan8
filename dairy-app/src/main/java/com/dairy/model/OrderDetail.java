package com.dairy.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "ORDER_DETAIL")
public class OrderDetail extends Base {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "ORDER_ID")
	private Order orderId;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@ManyToOne(cascade = CascadeType.DETACH)
	@Fetch(value = FetchMode.JOIN)
	@JoinColumn(name = "SELLER_PRODUCT_ID")
	private SellerProduct sellerProduct;

	@Column(name = "PRICE")
	private BigDecimal price;
	
	@Column(name = "TOTAL_PRICE")
	private BigDecimal totalPrice;
	
	@Column(name = "QUANTITY")
	private BigDecimal quantity;
	
	@Column(name = "STATUS")
	private String status;
	
	@Column(name = "DELIVERY_DATE")
	@JsonFormat(pattern = "dd-MMM-yyyy")
	@DateTimeFormat(pattern = "dd-MMM-yyyy")
	private LocalDate deliveryDate;

	@Column(name = "DELIVERED_BY")
	private String deliveredBy;
	
	@Column(name = "PENDING_QUANTITY")
	private BigDecimal pendingQuantity;
	
	@Column(name = "DUES")
	private BigDecimal dues;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Order getOrderId() {
		return orderId;
	}

	public void setOrderId(Order orderId) {
		this.orderId = orderId;
	}
	
	public SellerProduct getSellerProduct() {
		return sellerProduct;
	}

	public void setSellerProduct(SellerProduct sellerProduct) {
		this.sellerProduct = sellerProduct;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public BigDecimal getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(BigDecimal totalPrice) {
		this.totalPrice = totalPrice;
	}

	public BigDecimal getQuantity() {
		return quantity;
	}

	public void setQuantity(BigDecimal quantity) {
		this.quantity = quantity;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDate getDeliveryDate() {
		return deliveryDate;
	}

	public void setDeliveryDate(LocalDate deliveryDate) {
		this.deliveryDate = deliveryDate;
	}

	public String getDeliveredBy() {
		return deliveredBy;
	}

	public void setDeliveredBy(String deliveredBy) {
		this.deliveredBy = deliveredBy;
	}

	public BigDecimal getPendingQuantity() {
		return pendingQuantity;
	}

	public void setPendingQuantity(BigDecimal pendingQuantity) {
		this.pendingQuantity = pendingQuantity;
	}

	public BigDecimal getDues() {
		return dues;
	}

	public void setDues(BigDecimal dues) {
		this.dues = dues;
	}

	@Override
	public int hashCode() {
		return Objects.hash(deliveredBy, deliveryDate, dues, id, orderId, pendingQuantity, price, quantity, status,
				totalPrice);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		OrderDetail other = (OrderDetail) obj;
		return Objects.equals(deliveredBy, other.deliveredBy) && Objects.equals(deliveryDate, other.deliveryDate)
				&& Objects.equals(dues, other.dues) && Objects.equals(id, other.id)
				&& Objects.equals(orderId, other.orderId) && Objects.equals(pendingQuantity, other.pendingQuantity)
				&& Objects.equals(price, other.price) && Objects.equals(quantity, other.quantity)
				&& Objects.equals(status, other.status) && Objects.equals(totalPrice, other.totalPrice);
	}

	@Override
	public String toString() {
		return "OrderDetail [id=" + id + ", orderId=" + orderId + ", price=" + price + ", totalPrice=" + totalPrice
				+ ", quantity=" + quantity + ", status=" + status + ", deliveryDate=" + deliveryDate + ", deliveredBy="
				+ deliveredBy + ", pendingQuantity=" + pendingQuantity + ", dues=" + dues + "]";
	}
	
}
