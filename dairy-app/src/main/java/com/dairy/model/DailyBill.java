package com.dairy.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Formula;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;
//this table contains
//1 Daily Delivery
//2 Collection Daily
//3 Expense daily

@Entity
@Table(name = "DAILY_BILL")
public class DailyBill extends Base {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(name = "PARTY_ID")
	private Long partyId;
	
	@Column(name = "DATE")
	private String date;
	
	@Column(name = "MONTH")
	private String month;
	
	@Column(name = "DELIVERY_DATE")
	@JsonFormat(pattern = "dd-MMM-yyyy")
	@DateTimeFormat(pattern = "dd-MMM-yyyy")
	private LocalDate deliveryDate;
	
	@Column(name = "QUANTITY")
	private BigDecimal quantity;
	
	@Column(name = "AMOUNT")
	private BigDecimal amount;
	
	@Column(name = "fat")
	private BigDecimal fat;
	
	@Column(name = "snf")
	private BigDecimal snf;
	
	@Column(name = "water")
	private BigDecimal water;
	
	@Column(name = "rate")
	private BigDecimal rate;
	
	//expense or income
	@Column(name = "TYPE")
	private String type;
	
	//expense is for Petrol or Food etc.
	//income is from Chicken, Vehicle etc
	@Column(name = "Category")
	private String category;
	
	@Formula(value="(SELECT i.name FROM Party i WHERE i.id = party_Id)")
	private String party;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getPartyId() {
		return partyId;
	}

	public void setPartyId(Long partyId) {
		this.partyId = partyId;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public LocalDate getDeliveryDate() {
		return deliveryDate;
	}

	public void setDeliveryDate(LocalDate deliveryDate) {
		this.deliveryDate = deliveryDate;
	}

	public BigDecimal getQuantity() {
		return quantity;
	}

	public void setQuantity(BigDecimal quantity) {
		this.quantity = quantity;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	
	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getParty() {
		return party;
	}

	public void setParty(String party) {
		this.party = party;
	}

	public BigDecimal getFat() {
		return fat;
	}

	public void setFat(BigDecimal fat) {
		this.fat = fat;
	}

	public BigDecimal getSnf() {
		return snf;
	}

	public void setSnf(BigDecimal snf) {
		this.snf = snf;
	}

	public BigDecimal getWater() {
		return water;
	}

	public void setWater(BigDecimal water) {
		this.water = water;
	}

	public BigDecimal getRate() {
		return rate;
	}

	public void setRate(BigDecimal rate) {
		this.rate = rate;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((amount == null) ? 0 : amount.hashCode());
		result = prime * result + ((partyId == null) ? 0 : partyId.hashCode());
		result = prime * result + ((date == null) ? 0 : date.hashCode());
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((month == null) ? 0 : month.hashCode());
		result = prime * result + ((quantity == null) ? 0 : quantity.hashCode());
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
		DailyBill other = (DailyBill) obj;
		if (amount == null) {
			if (other.amount != null)
				return false;
		} else if (!amount.equals(other.amount))
			return false;
		if (partyId == null) {
			if (other.partyId != null)
				return false;
		} else if (!partyId.equals(other.partyId))
			return false;
		if (date == null) {
			if (other.date != null)
				return false;
		} else if (!date.equals(other.date))
			return false;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (month == null) {
			if (other.month != null)
				return false;
		} else if (!month.equals(other.month))
			return false;
		if (quantity == null) {
			if (other.quantity != null)
				return false;
		} else if (!quantity.equals(other.quantity))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "DailyBill [id=" + id + ", partyId=" + partyId + ", date=" + date + ", month=" + month
				+ ", quantity=" + quantity + ", amount=" + amount + "]";
	}

}
