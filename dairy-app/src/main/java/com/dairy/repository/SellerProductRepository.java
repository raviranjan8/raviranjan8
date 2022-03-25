package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dairy.model.SellerProduct;

public interface SellerProductRepository extends JpaRepository<SellerProduct, Long> {
}
