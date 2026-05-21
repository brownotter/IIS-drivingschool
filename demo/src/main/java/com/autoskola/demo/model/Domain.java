package com.autoskola.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "domains")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Domain {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long domainId;

    private String domainName;

    private Integer domainOrderNumber;
}