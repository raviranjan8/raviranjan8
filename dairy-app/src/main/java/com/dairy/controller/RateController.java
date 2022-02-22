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

import com.dairy.model.Rate;
import com.dairy.repository.RateRepository;

@CrossOrigin(allowedHeaders = "*")
@RestController
@RequestMapping("/api")
public class RateController {

	@Autowired
	RateRepository repoRepository;

	@GetMapping("/rates")
	public ResponseEntity<List<Rate>> getAllrates(@ModelAttribute Rate param) {
		try {
			List<Rate> responseList = new ArrayList<Rate>();
			
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

	@GetMapping("/rates/{id}")
	public ResponseEntity<Rate> getById(@PathVariable("id") long id) {
		Optional<Rate> idData = repoRepository.findById(id);

		if (idData.isPresent()) {
			return new ResponseEntity<>(idData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/rates")
	public ResponseEntity<Rate> create(@RequestBody Rate createData) {
		try {
			Rate createdData = repoRepository.save(createData);
			return new ResponseEntity<>(createdData, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping("/rates/{id}")
	public ResponseEntity<Rate> update(@PathVariable("id") long id, @RequestBody Rate updateData) {
		try {
			Rate updatedData = repoRepository.save(updateData);
			return new ResponseEntity<>(updatedData, HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/rates/{id}")
	public ResponseEntity<HttpStatus> delete(@PathVariable("id") long id) {
		try {
			repoRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@DeleteMapping("/rates")
	public ResponseEntity<HttpStatus> deleteAllRates() {
		try {
			repoRepository.deleteAll();
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}
}
