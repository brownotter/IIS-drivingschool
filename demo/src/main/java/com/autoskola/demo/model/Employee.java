package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "employees")
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class Employee extends User {

}