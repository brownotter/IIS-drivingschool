package com.autoskola.demo.repository;

import com.autoskola.demo.model.Category;
import com.autoskola.demo.model.CategoryPackage;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryPackageRepository
        extends JpaRepository<CategoryPackage, Long> {

    Optional<CategoryPackage>
    findByCategory(Category category);
}