package com.dairy.model;

import java.math.BigDecimal;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "SELLER_PRODUCT")
@EntityListeners(AuditingEntityListener.class)
public class SellerProduct extends Base {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "DESCRIPTION")
	private String description;
	
	@Column(name = "IMAGE_PATH")
	private String imagePath;
	
	@Column(name = "PRODUCT_ID")
	private Long productId;
	
	@Column(name = "BRAND")
	private String brand;
	
	@Column(name = "COMPANY")
	private String company;
	
	@Column(name = "MRP")
	private BigDecimal mrp;
	
	@Column(name = "UNIT")
	private String unit;
	
	@Column(name = "WEIGHT")
	private BigDecimal weight;
	
	@Column(name = "MEASUREMENT")
	private String measurment;
	
	@Column(name = "QUANTITY")
	private BigDecimal quantity;
	
	@Column(name = "RATE")
	private BigDecimal rate;
	
	@Column(name = "DISCOUNT")
	private BigDecimal discount;
	
	@Column(name = "DISCOUNT_TYPE")
	private String discountType;
	
	@Column(name = "DELIVERY_CHARGE")
	private BigDecimal deliveryCharge;
	
	@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
	@ManyToOne
	@Fetch(value = FetchMode.JOIN)
	@JoinColumn(name = "PRODUCT_ID", insertable = false, updatable = false)
	private Product product;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public BigDecimal getMrp() {
		return mrp;
	}

	public void setMrp(BigDecimal mrp) {
		this.mrp = mrp;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public BigDecimal getWeight() {
		return weight;
	}

	public void setWeight(BigDecimal weight) {
		this.weight = weight;
	}

	public String getMeasurment() {
		return measurment;
	}

	public void setMeasurment(String measurment) {
		this.measurment = measurment;
	}

	public BigDecimal getQuantity() {
		return quantity;
	}

	public void setQuantity(BigDecimal quantity) {
		this.quantity = quantity;
	}

	public BigDecimal getRate() {
		return rate;
	}

	public void setRate(BigDecimal rate) {
		this.rate = rate;
	}

	public BigDecimal getDiscount() {
		return discount;
	}

	public void setDiscount(BigDecimal discount) {
		this.discount = discount;
	}

	public String getDiscountType() {
		return discountType;
	}

	public void setDiscountType(String discountType) {
		this.discountType = discountType;
	}

	public BigDecimal getDeliveryCharge() {
		return deliveryCharge;
	}

	public void setDeliveryCharge(BigDecimal deliveryCharge) {
		this.deliveryCharge = deliveryCharge;
	}
	
	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}

	public Long getProductId() {
		return productId;
	}

	public void setProductId(Long productId) {
		this.productId = productId;
	}
	
	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	@Override
	public int hashCode() {
		return Objects.hash(brand, company, deliveryCharge, description, discount, discountType, id, measurment, mrp,
				 imagePath, productId, quantity, rate, unit, weight);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		SellerProduct other = (SellerProduct) obj;
		return Objects.equals(brand, other.brand) && Objects.equals(company, other.company)
				&& Objects.equals(deliveryCharge, other.deliveryCharge)
				&& Objects.equals(description, other.description) && Objects.equals(discount, other.discount)
				&& Objects.equals(discountType, other.discountType) && Objects.equals(id, other.id)
				&& Objects.equals(measurment, other.measurment) && Objects.equals(mrp, other.mrp)
				&& Objects.equals(imagePath, other.imagePath)
				&& Objects.equals(productId, other.productId) && Objects.equals(quantity, other.quantity)
				&& Objects.equals(rate, other.rate) && Objects.equals(unit, other.unit)
				&& Objects.equals(weight, other.weight);
	}

	@Override
	public String toString() {
		return "SellerProduct [id=" + id + ", description=" + description + ", imagePath=" + imagePath
				+ ", productId=" + productId + ", brand=" + brand + ", company=" + company + ", mrp=" + mrp + ", unit="
				+ unit + ", weight=" + weight + ", measurment=" + measurment + ", quantity=" + quantity + ", rate="
				+ rate + ", discount=" + discount + ", discountType=" + discountType + ", deliveryCharge="
				+ deliveryCharge + "]";
	}
	
}
