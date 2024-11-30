package com.nci.skeleton.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Data
@Table(name = "properties")
public class Property {
    @Id
    private UUID id;
    private String name;
    @Column(length = 3000)
    private String address;
    private String eircode;
    @Column(length = 3000)
    private String description;
    private String postalCode;
    private BigDecimal rent;
    private BigDecimal deposit;
    private BigDecimal area;
    private LocalDate availableFrom;
    private String energyRatings;
    private Integer bedrooms;
    private Integer bathrooms;
    private List<String> amenities;
    private List<String> images;
    private String propertyType;
    private String status;
    private String postedBy;
    private LocalDateTime postedOn;
    private LocalDateTime modifiedOn;
}
