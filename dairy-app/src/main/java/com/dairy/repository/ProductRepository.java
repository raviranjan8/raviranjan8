package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dairy.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
