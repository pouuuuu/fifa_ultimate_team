package com.bss.fut.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;

@Entity
@Data
public class ActiveTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private String formation;

    @ManyToMany
    @JoinTable(
            name = "active_team_cards",
            joinColumns = @JoinColumn(name = "active_team_id"),
            inverseJoinColumns = @JoinColumn(name = "user_card_id")
    )
    private ArrayList<UserCard> players = new ArrayList<>();


    public int getTeamRating() {
        if (players == null || players.isEmpty()) {
            return 0;
        } else {
            int total = 0;
            for (UserCard player : players) {
                total += player.getPlayer().getRating();
            }
            return total / 11;
        }
    }
}
