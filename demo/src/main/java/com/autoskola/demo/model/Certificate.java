package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.time.LocalDate;

@Entity
@Table(name = "certificates")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Certificate extends Documents {

    @Column(name = "cerf_numb", nullable = false, unique = true)
    private String cerfNumb;

    @Column(name = "cerf_date", nullable = false)
    private LocalDate cerfDate;

    @Column(name = "valid_date")
    private LocalDate validDate;
}