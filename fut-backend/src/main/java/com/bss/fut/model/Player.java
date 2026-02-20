package com.bss.fut.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Player {
    @Id
    private Long id;

    private String name;
    private String surname;
    private int rating;

    private CardType cardType;

    private String country;
    private String club;

    private String playerImagePath;
    private String cardImagePath;
    private String clubImagePath;
    private String countryImagePath;

}
