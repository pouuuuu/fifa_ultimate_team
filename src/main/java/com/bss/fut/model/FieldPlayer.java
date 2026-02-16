package com.bss.fut.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class FieldPlayer extends Player {

    @Enumerated(EnumType.STRING)
    private Position position;

    private int pac;
    private int sho;
    private int pas;
    private int dri;
    private int def;
    private int phy;
}
