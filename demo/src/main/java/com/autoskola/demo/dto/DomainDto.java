package com.autoskola.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DomainDto {
    private Long domainId;
    private String domainName;
    private Integer domainOrderNumber;
}
