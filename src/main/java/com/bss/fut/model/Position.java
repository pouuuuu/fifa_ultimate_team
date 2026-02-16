package com.bss.fut.model;

import lombok.Getter;

@Getter
public enum Position {

    CB("Center Back"),
    RB("Right Back"),
    LB("Left Back"),
    RWB("Right Wing Back"),
    LWB("Left Wing Back"),

    CDM("Central Defensive Midfielder"),
    CM("Central Midfielder"),
    CAM("Central Attack Midfielder"),
    RM("Right Midfielder"),
    LM("Left Midfielder"),

    RW("Right Winger"),
    LW("Left Winger"),
    RF("Right Forward"),
    LF("Left Forward"),
    CF("Center Forward"),
    ST("Striker");

    private final String fullName;

    Position(String fullName) {
        this.fullName = fullName;
    }

    @Override
    public String toString() {
        return this.fullName;
    }
}
