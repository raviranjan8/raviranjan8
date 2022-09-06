package com.dairy.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.dairy.model.SellerProduct;

public interface SellerProductRepository extends JpaRepository<SellerProduct, Long> {
	
	@Query("SELECT b FROM SellerProduct b where b.active = true "
			+ " and (soundex( lower (description) ) = soundex( lower( ?1 )) "
			+ " or soundex( lower (product.name) ) = soundex( lower( ?1 ) )  )")
	List<SellerProduct> searchProduct(String search);
}
