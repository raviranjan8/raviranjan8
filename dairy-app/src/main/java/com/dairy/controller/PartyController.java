package com.dairy.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Sort;
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

import com.dairy.model.Party;
import com.dairy.repository.PartyRepository;

@CrossOrigin(allowedHeaders = "*")
@RestController
@RequestMapping("/api")
public class PartyController {

	@Autowired
	PartyRepository repository;
	
	DateTimeFormatter formatMonth = DateTimeFormatter.ofPattern("MMM-yyyy");
	DateTimeFormatter formatDate = DateTimeFormatter.ofPattern("dd");

	@GetMapping("/partys")
	public ResponseEntity<List<Party>> getAllCustomers(@ModelAttribute Party param) {
		try {
			List<Party> responseList = new ArrayList<Party>();
			
			if(null != param && null == param.getSearchFlag()) {
				repository.findAll(Example.of(param), Sort.by("routeId","routeSeq")).forEach(responseList::add);
			}else if(null != param && null != param.getSearchFlag() && "pending".equals(param.getSearchFlag())) {
				repository.findPendingCustomer(param.getRouteId(),LocalDate.now().format(formatMonth),LocalDate.now().format(formatDate)).forEach(responseList::add);
			} else if(null != param && null != param.getSearchFlag() && "non-customer".equals(param.getSearchFlag())) {
				repository.findNonCustomerParties().forEach(responseList::add);
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

	@GetMapping("/partys/{id}")
	public ResponseEntity<Party> getById(@PathVariable("id") long id) {
		Optional<Party> idData = repository.findById(id);

		if (idData.isPresent()) {
			return new ResponseEntity<>(idData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/partys")
	public ResponseEntity<Party> create(@RequestBody Party createData) {
		try {
			Party createdData = repository.save(createData);
			return new ResponseEntity<>(createdData, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/partys/{id}")
	public ResponseEntity<Party> update(@PathVariable("id") long id, @RequestBody Party updateData) {
		try {
			Party updatedData = repository.save(updateData);
			return new ResponseEntity<>(updatedData, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/partys/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") long id) {
		try {
			repository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/partys")
	public ResponseEntity<HttpStatus> deleteAll() {
		try {
			repository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
}
