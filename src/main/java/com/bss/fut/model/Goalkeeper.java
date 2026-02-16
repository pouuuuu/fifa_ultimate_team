package com.bss.fut.model;

import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class Goalkeeper extends Player {

    private int div;
    private int han;
    private int kic;
    private int ref;
    private int spe;
    private int pos;
}
