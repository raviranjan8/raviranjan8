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

import com.dairy.model.Payment;
import com.dairy.repository.PaymentRepository;

@CrossOrigin(allowedHeaders = "*")
@RestController
@RequestMapping("/api")
public class PaymentController {

	@Autowired
	PaymentRepository repoRepository;

	@GetMapping("/payments")
	public ResponseEntity<List<Payment>> getAllpayments(@ModelAttribute Payment param) {
		try {
			List<Payment> responseList = new ArrayList<Payment>();
			
			if(null != param) {
				repoRepository.findAll(Example.of(param)).forEach(responseList::add);
			}else {
				repoRepository.findAll().forEach(responseList::add);
			}
			if (responseList.isEmpty()) {
				return new ResponseEntity<>(HttpStatus.NO_CONTENT);
			}
			return new ResponseEntity<>(responseList, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/payments/{id}")
	public ResponseEntity<Payment> getById(@PathVariable("id") long id) {
		Optional<Payment> idData = repoRepository.findById(id);

		if (idData.isPresent()) {
			return new ResponseEntity<>(idData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/payments")
	public ResponseEntity<Payment> create(@RequestBody Payment createData) {
		try {
			Payment createdData = repoRepository.save(createData);
			return new ResponseEntity<>(createdData, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/payments/{id}")
	public ResponseEntity<Payment> update(@PathVariable("id") long id, @RequestBody Payment updateData) {
		try {
			Payment updatedData = repoRepository.save(updateData);
			return new ResponseEntity<>(updatedData, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/payments/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") long id) {
		try {
			repoRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/payments")
	public ResponseEntity<HttpStatus> deleteAllPayments() {
		try {
			repoRepository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
}
