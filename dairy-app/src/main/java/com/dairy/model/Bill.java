package com.dairy.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "BILL")
public class Bill extends Base{

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Column(name = "PARTY_ID")
	private Long partyId;
	
	@Column(name = "MONTH")
	private String month;

	@Column(name = "QUANTITY")
	private BigDecimal quantity;
	
	@Column(name = "RATE")
	private BigDecimal rate;
	
	@Column(name = "BILL")
	private BigDecimal bill;
	
	@Column(name = "PAYMENT")
	private BigDecimal payment;
	
	@Column(name = "LAST_BILL_TOTAL")
	private BigDecimal lastBillTotal;
	
	@Column(name = "DISCOUNT")
	private BigDecimal discount;
	
	@Column(name = "DUES")
	private BigDecimal dues;
	
	@Column(name = "DAYS_COUNT")
	private Long daysCount;

	@Column(name = "ACTIVE")
	private Boolean active;
	
	@Column(name = "TYPE")
	private String type;
	
	@Column(name = "CATEGORY")
	private String category;
	
	@JsonBackReference
	@ManyToOne
	@JoinColumn(name = "PARTY_ID", insertable = false, updatable = false)
	private Party customer;
	
	@JsonFormat(pattern = "yyyy-MMM-dd")
	@Column(name = "FROM_DATE")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private LocalDate from;
	
	@JsonFormat(pattern = "yyyy-MMM-dd" )
	@Column(name = "TO_DATE")
	@DateTimeFormat(pattern = "yyyy-MM-dd")
	private LocalDate to;

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

	public BigDecimal getBill() {
		return bill;
	}

	public void setBill(BigDecimal bill) {
		this.bill = bill;
	}

	public BigDecimal getPayment() {
		return payment;
	}

	public void setPayment(BigDecimal payment) {
		this.payment = payment;
	}

	public BigDecimal getLastBillTotal() {
		return lastBillTotal;
	}

	public void setLastBillTotal(BigDecimal lastBillTotal) {
		this.lastBillTotal = lastBillTotal;
	}

	public BigDecimal getDiscount() {
		return discount;
	}

	public void setDiscount(BigDecimal discount) {
		this.discount = discount;
	}

	public BigDecimal getDues() {
		return dues;
	}

	public void setDues(BigDecimal dues) {
		this.dues = dues;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public Boolean isActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Long getDaysCount() {
		return daysCount;
	}

	public void setDaysCount(Long daysCount) {
		this.daysCount = daysCount;
	}

	public Boolean getActive() {
		return active;
	}
	
	public Party getCustomer() {
		return customer;
	}

	public void setCustomer(Party customer) {
		this.customer = customer;
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

	public LocalDate getFrom() {
		return from;
	}

	public void setFrom(LocalDate from) {
		this.from = from;
	}

	public LocalDate getTo() {
		return to;
	}

	public void setTo(LocalDate to) {
		this.to = to;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + (active ? 1231 : 1237);
		result = prime * result + ((bill == null) ? 0 : bill.hashCode());
		result = prime * result + (int) (partyId ^ (partyId >>> 32));
		result = prime * result + ((dues == null) ? 0 : dues.hashCode());
		result = prime * result + (int) (id ^ (id >>> 32));
		result = prime * result + ((month == null) ? 0 : month.hashCode());
		result = prime * result + ((payment == null) ? 0 : payment.hashCode());
		result = prime * result + ((quantity == null) ? 0 : quantity.hashCode());
		result = prime * result + ((rate == null) ? 0 : rate.hashCode());
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
		Bill other = (Bill) obj;
		if (active != other.active)
			return false;
		if (bill == null) {
			if (other.bill != null)
				return false;
		} else if (!bill.equals(other.bill))
			return false;
		if (partyId != other.partyId)
			return false;
		if (dues == null) {
			if (other.dues != null)
				return false;
		} else if (!dues.equals(other.dues))
			return false;
		if (id != other.id)
			return false;
		if (month == null) {
			if (other.month != null)
				return false;
		} else if (!month.equals(other.month))
			return false;
		if (payment == null) {
			if (other.payment != null)
				return false;
		} else if (!payment.equals(other.payment))
			return false;
		if (quantity == null) {
			if (other.quantity != null)
				return false;
		} else if (!quantity.equals(other.quantity))
			return false;
		if (rate == null) {
			if (other.rate != null)
				return false;
		} else if (!rate.equals(other.rate))
			return false;
		return true;
	}

	@Override
	public String toString() {
		return "Bill [id=" + id + ", partyId=" + partyId + ", quantity=" + quantity + ", rate=" + rate + ", bill="
				+ bill + ", payment=" + payment + ", dues=" + dues + ", month=" + month + ", active=" + active + "]";
	}
}
