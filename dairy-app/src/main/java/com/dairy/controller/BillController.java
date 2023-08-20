package com.dairy.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dairy.model.Bill;
import com.dairy.model.DailyBill;
import com.dairy.model.Party;
import com.dairy.model.Payment;
import com.dairy.model.Rate;
import com.dairy.repository.BillRepository;
import com.dairy.repository.DailyBillRepository;
import com.dairy.repository.PartyRepository;
import com.dairy.repository.PaymentRepository;
import com.dairy.repository.RateRepository;

@CrossOrigin(allowedHeaders = "*")
@RestController
@RequestMapping("/api")
public class BillController {

	@Autowired
	BillRepository repository;
	
	@Autowired
	RateRepository rateRepository;
	
	@Autowired
	DailyBillRepository customerDeliveryRepository;
	
	@Autowired
	PartyRepository customerRepository;
	
	@Autowired
	PaymentRepository paymentRepository;
	
	DateTimeFormatter format = DateTimeFormatter.ofPattern("dd-MMM-yyyy");
	DateTimeFormatter formatMonth = DateTimeFormatter.ofPattern("MMM-yyyy");
	
	final BigDecimal zero = new BigDecimal(0);
	
	/**
	 * 1. Takes active Customer list
	 * 2. Takes entire delivery data for the month
	 * 3. Takes the bill data for the month
	 * 4. Takes the bill data for previous month
	 * 5. Create new bill object for the distinct customer which were delivered from #1 step
	 * 6. Sum quantity from delivery data from step #2 and create bill with rate multiply
	 * 7. Extract and sum all the payments made in the month for Dues calculation from bills of steps #3 
	 * 				and set the bill data to be marked as inactive and keep payment data as is
	 * 8. Prepare due amount from previous month bills data from step #4 by using previous bills & dues and payment of this month
	 * 9. Saves the inactive marked bill as inactive
	 * 10. saves the new bill
	 * @param param
	 * @return
	 */
	@GetMapping("/generateBills")
	public ResponseEntity<?> generateBills(@ModelAttribute Bill param) {
		try {
			param.setActive(true);
			//get active customer
			List<Party> customerList = customerRepository.findDistinctIdByActive(true);
			
			DailyBill paramDelivery= new DailyBill();
			paramDelivery.setMonth(param.getMonth());
			paramDelivery.setType(param.getType());	
			//get all deliveries for all customers for the month
			List<DailyBill> customerDeliveryList = customerDeliveryRepository.findAll(Example.of(paramDelivery));
			
			Rate paramRate = new Rate();
			paramRate.setActive(true);
			List<Rate> rate = rateRepository.findAll(Example.of(paramRate));
			
			//last month bill - it will be used to calculate dues
			List<Bill> previousBills = new ArrayList<Bill>();
			
			Bill paramPrevMonth = new Bill();
			LocalDate paramDate = LocalDate.parse("01-"+param.getMonth(),format);
			paramPrevMonth.setMonth(paramDate.minusMonths(1).format(formatMonth));
			paramPrevMonth.setActive(true);
			paramPrevMonth.setType(param.getType());
			repository.findAll(Example.of(paramPrevMonth)).forEach(previousBills::add);
			
			//this month bill to de-active
			List<Bill> existingBills = new ArrayList<Bill>();		
			repository.findAll(Example.of(param)).forEach(existingBills::add);
			
			//this month bill to see payments
			Payment paymentParam=new Payment();
			paymentParam.setActive(true);
			paymentParam.setMonth(param.getMonth());
			paymentParam.setType(param.getType());
			List<Payment> payments = new ArrayList<Payment>();		
			paymentRepository.findAll(Example.of(paymentParam)).forEach(payments::add);
					
			List<Bill> billsToBeDeActivated = new ArrayList<Bill>();
			
			List<Bill> billsForCreation = new ArrayList<Bill>();	
			customerList.stream().forEach(customer -> {
				Bill customerBill = new Bill();
				customerBill.setPartyId(customer.getId());
				customerBill.setMonth(param.getMonth());
				if(null ==rate || rate.size()==0) {
					customerBill.setRate(new BigDecimal(1));
				} else customerBill.setRate(rate.get(0).getRate());
				
				//if there is rate set for customer then, it will take customer rate
				//otherwise it will take Dairy rate
				if(null != customer.getRate() && customer.getRate().compareTo(zero)>0) {
					customerBill.setRate(customer.getRate());
				}
				
				customerBill.setActive(true);
				customerBill.setType(param.getType());
				
				customerBill.setDaysCount(0L);
				customerBill.setQuantity(new BigDecimal(0));
				customerBill.setDues(new BigDecimal(0));
				customerBill.setPayment(new BigDecimal(0));
				customerBill.setDiscount(new BigDecimal(0));
				customerBill.setBill(new BigDecimal(0));
				customerBill.setLastBillTotal(new BigDecimal(0));
				customerDeliveryList.stream().
					filter(c -> c.getPartyId().equals(customer.getId())).forEach(customerDelivery  ->{
						if(null != customerDelivery.getQuantity()) {
							customerBill.setQuantity(customerBill.getQuantity().add(customerDelivery.getQuantity()));
						}
						//for expense, sum of amount is the billed amount
						if(null != customerDelivery.getAmount()) {
							customerBill.setBill(customerBill.getBill().add(customerDelivery.getAmount()));
						}
						customerBill.setDaysCount(customerBill.getDaysCount()+1);
					});
				
				if(param.getType().equals("income")) {
					//for income, rate * quantity is the billed amount
					customerBill.setBill(customerBill.getQuantity().multiply(customerBill.getRate()));
				}
				
				existingBills.stream().
					filter(c -> c.getPartyId().equals(customer.getId())).forEach(bill ->{
						//all previous bill be deactivated for the month except payment One
						bill.setActive(false);
						billsToBeDeActivated.add(bill);
					});
				
				payments.stream().
					filter(c -> c.getPartyId().equals(customer.getId())).forEach(payment ->{
							//payment with discount category is discount
							if(null != payment.getCategory() && "discount".equals(payment.getCategory())) {
								customerBill.setDiscount(customerBill.getDiscount().add(payment.getPayment()));
							}else {
								//and all paid amount for the month will be used to calculate dues against previous month bill
								customerBill.setPayment(customerBill.getPayment().add(payment.getPayment()));
							}
							//also to show total payment against last month bill
				});
				
				previousBills.stream().
					filter(c -> c.getPartyId().equals(customer.getId())).forEach(bill ->{
						if(param.getType().equals("income")) {
							//this month bill + last month dues = last  month total bill
							BigDecimal previousMonthTotal = new BigDecimal(0);
							if(null != bill.getBill()) {
								previousMonthTotal = previousMonthTotal.add(bill.getBill());
							}
							if(null != bill.getDues()) {
								previousMonthTotal = previousMonthTotal.add(bill.getDues());
							}
							customerBill.setLastBillTotal(customerBill.getLastBillTotal().add(previousMonthTotal));
						}else {		//for expense billing	
							//last month bill - last month payment = dues 
							BigDecimal previousMonthDue = new BigDecimal(0);
							if(null != bill.getBill()) {
								previousMonthDue = previousMonthDue.add(bill.getBill());
							}
							if(null != bill.getPayment()) {
								previousMonthDue = previousMonthDue.subtract(bill.getPayment());
							}
							customerBill.setDues(customerBill.getDues().add(previousMonthDue));
						}
					});
				
				if(param.getType().equals("income")) {
					//last month total bill - this month payment - this month discount = dues
					//negative due means Advance
					customerBill.setDues(customerBill.getLastBillTotal().subtract(customerBill.getPayment())
											.subtract(customerBill.getDiscount()));
				}
				
				//generate bill only if any delivery was done or any due is there or any payment made income/expense
				if(customerBill.getQuantity().compareTo(zero)>0 || customerBill.getDues().compareTo(zero)>0 || customerBill.getPayment().compareTo(zero)>0) {
					billsForCreation.add(customerBill);
				}
			});
			repository.saveAll(billsToBeDeActivated);
			//send the latest bill generated to UI
			List<Bill> responseList = repository.saveAll(billsForCreation);		
			if (responseList.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(responseList, HttpStatus.OK);
		}catch (Exception e) {
			return new ResponseEntity<>(e,HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping("/generateBills/{month}/{type}")
	public ResponseEntity<Bill>  validateBillGeneration(@PathVariable("month") String month, @PathVariable("type") String type) {
		List<Bill> billList = repository.findActiveBillForTheMonth(month, type);
		if (null != billList && billList.size()>0) {
			return new ResponseEntity<>(billList.get(0), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/bills")
	public ResponseEntity<List<Bill>> getAllBills(@ModelAttribute Bill param) {
		try {
			List<Bill> responseList = new ArrayList<Bill>();
			
			if(null != param) {
				if(null != param.getFrom())
					repository.findActiveBillForThePeriod(param.getFrom(), param.getFrom(), param.getType()).forEach(responseList::add);
				else repository.findAll(Example.of(param)).forEach(responseList::add);
			}else {
				repository.findAll().forEach(responseList::add);
			}
			if (responseList.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(responseList, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/bills/{id}")
	public ResponseEntity<Bill> getById(@PathVariable("id") long id) {
		Optional<Bill> idData = repository.findById(id);

		if (idData.isPresent()) {
			return new ResponseEntity<>(idData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/bills")
	public ResponseEntity<Bill> create(@RequestBody Bill createData) {
		try {
			Bill createdData = repository.save(createData);
			return new ResponseEntity<>(createdData, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/bills/{id}")
	public ResponseEntity<Bill> update(@PathVariable("id") long id, @RequestBody Bill updateData) {
		try {
			Bill updatedData = repository.save(updateData);
			return new ResponseEntity<>(updatedData, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/bills/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") long id) {
		try {
			repository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/bills")
	public ResponseEntity<HttpStatus> deleteAll() {
		try {
			repository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
	
	@GetMapping("/generateBillsCollection")
	public ResponseEntity<List<Bill>>  generateBillsCollection(@ModelAttribute Bill param) {
		System.out.println("Test Collection");
		param.setActive(true);
		//get active customer
		List<Long> customerIdList = customerRepository.findDistinctFarmersIdByActive(true);
		
		//fetching daily collection for the given period
		List<DailyBill> customerDeliveryList = customerDeliveryRepository.findActiveBillForThePeriod(param.getFrom(), param.getTo(), param.getType());
		
		//the given period bill to de-active
		List<Bill> existingBills = new ArrayList<Bill>();
		repository.findAll(Example.of(param)).forEach(existingBills::add);
		
		//if there is no ExistingBills with exact From and To date match, then check
		if(null == existingBills || existingBills.size()==0) {
			//if there is any bill in the period and if any bill existing for period but exact math with
			//To and From and not giving any result, then error
			List<Bill> existingBillForPeriod = repository.findActiveBillForThePeriod(param.getFrom(), param.getTo(), param.getType());
			if(null != existingBillForPeriod && existingBillForPeriod.size()>0) {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		}
		
				
		List<Bill> billsToBeDeActivated = new ArrayList<Bill>();
		
		List<Bill> billsForCreation = new ArrayList<Bill>();	
		customerIdList.stream().forEach(customerId -> {
			Bill customerBill = new Bill();
			customerBill.setPartyId(customerId);
			customerBill.setMonth(param.getMonth());
			customerBill.setFrom(param.getFrom());
			customerBill.setTo(param.getTo());
			customerBill.setActive(true);
			customerBill.setType(param.getType());
			customerBill.setCategory(param.getCategory());	
			
			customerBill.setDaysCount(0L);
			customerBill.setQuantity(new BigDecimal(0));
			customerBill.setBill(new BigDecimal(0));
			
			customerDeliveryList.stream().
				filter(c -> c.getPartyId().equals(customerId)).forEach(customerDelivery  ->{
					if(null != customerDelivery.getQuantity()) {
						customerBill.setQuantity(customerBill.getQuantity().add(customerDelivery.getQuantity()));
					}
					//for expense, sum of amount is the billed amount
					if(null != customerDelivery.getAmount()) {
						customerBill.setBill(customerBill.getBill().add(customerDelivery.getAmount()));
					}
					customerBill.setDaysCount(customerBill.getDaysCount()+1);
				});
			
			existingBills.stream().
				filter(c -> c.getPartyId().equals(customerId)).forEach(bill ->{
					//all previous bill be deactivated for the month except payment One
					bill.setActive(false);
					billsToBeDeActivated.add(bill);
				});
			
			//generate bill only if any delivery was done or any due is there or any payment made income/expense
			if(customerBill.getQuantity().compareTo(zero)>0) {
				billsForCreation.add(customerBill);
			}
		});
		repository.saveAll(billsToBeDeActivated);
		//send the latest bill generated to UI
		List<Bill> responseList = repository.saveAll(billsForCreation);		
		if (responseList.isEmpty()) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		return new ResponseEntity<>(responseList, HttpStatus.OK);
	}
	
	@GetMapping("/generateBillsCollection/{type}")
	public ResponseEntity<Bill>   validateCollectionBillsGeneration(@ModelAttribute Bill param) {
		List<Bill> billList = repository.findActiveBillForThePeriod(param.getFrom(), param.getTo(), param.getType());
		if (null != billList && billList.size()>0) {
			return new ResponseEntity<>(billList.get(0), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

}
