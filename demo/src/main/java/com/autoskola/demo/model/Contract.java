package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "contracts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Contract extends Documents {

    @Column(name = "cont_numb", nullable = false, unique = true)
    private String contNumb;

    @Column(name = "cont_start_date", nullable = false)
    private LocalDate contStartDate;

    @Column(name = "ammount_cont", nullable = false, precision = 10, scale = 2)
    private BigDecimal ammountCont;
}