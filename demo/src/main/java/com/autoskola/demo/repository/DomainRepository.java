package com.autoskola.demo.repository;

import com.autoskola.demo.model.Domain;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DomainRepository extends JpaRepository<Domain, Long> {
}