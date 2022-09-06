package com.dairy.controller;

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

import com.dairy.model.DailyBill;
import com.dairy.repository.DailyBillRepository;

@CrossOrigin(allowedHeaders = "*")
@RestController
@RequestMapping("/api")
public class DailyBillController {

	@Autowired
	DailyBillRepository repository;

	@GetMapping("/dailyBills")
	public ResponseEntity<List<DailyBill>> getAllCustomerDeliverys(@ModelAttribute DailyBill param) {
		try {
			List<DailyBill> responseList = new ArrayList<DailyBill>();
			
			
			if(null != param) {
				if(null != param.getSearchFlag() && param.getSearchFlag().equals("not-collection")) {
					repository.findExpenseDailyBillExceptCollection(param.getType(), param.getMonth()).forEach(responseList::add);
				}else repository.findAll(Example.of(param)).forEach(responseList::add);
			}else {
				repository.findAll().forEach(responseList::add);
			}
			if (responseList.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(responseList, HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/dailyBills/{id}")
	public ResponseEntity<DailyBill> getById(@PathVariable("id") long id) {
		Optional<DailyBill> idData = repository.findById(id);

		if (idData.isPresent()) {
			return new ResponseEntity<>(idData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/dailyBills")
	public ResponseEntity<DailyBill> create(@RequestBody DailyBill createData) {
		try {
			DailyBill createdData = repository.save(createData);
			return new ResponseEntity<>(createdData, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	/**
	 * This method is created to save delivery data, specially for save coming from tabular pages
	 * tabular page have chance to send two Create request at the same time and they are getting saved with two Id.
	 * Those should have got as update actually
	 * @param createData
	 * @return
	 */
	@PostMapping("/dailyBills/delivery")
	public ResponseEntity<DailyBill> createDailyBill(@RequestBody DailyBill createData) {
		try {
			ResponseEntity<List<DailyBill>> savedData = getAllCustomerDeliverys(createData);
			//if data is already saved, then get the ID and update record
			if(null != savedData && null != savedData.getBody() && null != savedData.getBody().get(0)) {
				createData.setId(savedData.getBody().get(0).getId());
			}
			DailyBill createdData = repository.save(createData);
			return new ResponseEntity<>(createdData, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/dailyBills/{id}")
	public ResponseEntity<DailyBill> update(@PathVariable("id") long id, @RequestBody DailyBill updateData) {
		try {
			DailyBill updatedData = repository.save(updateData);
			return new ResponseEntity<>(updatedData, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/dailyBills/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") long id) {
		try {
			repository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/dailyBills")
	public ResponseEntity<HttpStatus> deleteAll() {
		try {
			repository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
}
