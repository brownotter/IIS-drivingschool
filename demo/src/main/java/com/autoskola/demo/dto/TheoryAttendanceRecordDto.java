package com.autoskola.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TheoryAttendanceRecordDto {
    private Long attendanceId;
    private String status;
}