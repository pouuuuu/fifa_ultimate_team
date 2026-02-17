package com.bss.fut.model;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@PrimaryKeyJoinColumn(name = "player_id")
public class Goalkeeper extends Player {

    private int div;
    private int han;
    private int kic;
    private int ref;
    private int spe;
    private int pos;
}
