package com.dairy.model;

import java.math.BigDecimal;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Table(name = "STOCK")
@EntityListeners(AuditingEntityListener.class)
public class Stock extends Base {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "seller_product_id")
	private Long sellerProductId;
	
	@Column(name = "STOCK_QUANTITY")
	private BigDecimal stockQuantity;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getSellerProductId() {
		return sellerProductId;
	}

	public void setSellerProductId(Long sellerProductId) {
		this.sellerProductId = sellerProductId;
	}

	public BigDecimal getStockQuantity() {
		return stockQuantity;
	}

	public void setStockQuantity(BigDecimal stockQuantity) {
		this.stockQuantity = stockQuantity;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, sellerProductId, stockQuantity);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Stock other = (Stock) obj;
		return Objects.equals(id, other.id) && Objects.equals(sellerProductId, other.sellerProductId)
				&& Objects.equals(stockQuantity, other.stockQuantity);
	}

	@Override
	public String toString() {
		return "Stock [id=" + id + ", sellerProductId=" + sellerProductId + ", stockQuantity=" + stockQuantity + "]";
	}
	
}
