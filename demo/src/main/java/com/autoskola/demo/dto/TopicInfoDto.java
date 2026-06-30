package com.autoskola.demo.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopicInfoDto {

    private Long id;
    private String name;
    private String area;
    private String displayName;
}
