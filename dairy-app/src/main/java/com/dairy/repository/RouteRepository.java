package com.dairy.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dairy.model.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {
}
