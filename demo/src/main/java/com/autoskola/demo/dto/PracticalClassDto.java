package com.autoskola.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PracticalClassDto {

    private int orderNum;
    private String topicName;
    private String classDate;
    private String startTime;
    private String endTime;
    private String note;
    private String status;
}
