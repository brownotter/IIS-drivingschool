package com.autoskola.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CandidateTheoryAttendanceInfoDto {
    private Long attendanceId;
    private Long candidateId;
    private String firstName;
    private String lastName;
    private String status;
}