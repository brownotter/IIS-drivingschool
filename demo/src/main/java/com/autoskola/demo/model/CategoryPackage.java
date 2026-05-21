package com.autoskola.demo.model;

import com.autoskola.demo.model.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "category_packages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Category category;

    private double price;
}