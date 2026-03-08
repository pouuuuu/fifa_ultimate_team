package com.bss.fut.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class MarketListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Le vendeur
    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    // La carte physique mise en vente
    @OneToOne
    @JoinColumn(name = "user_card_id", nullable = false)
    private UserCard userCard;

    @Column(nullable = false)
    private int price;

    // Permet de savoir si l'offre est toujours disponible ou déjà vendue
    private boolean active = true;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}