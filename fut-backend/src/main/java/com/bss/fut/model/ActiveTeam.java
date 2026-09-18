package com.bss.fut.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

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

    @ManyToOne
    @JoinColumn(name = "lw_card_id")
    private UserCard lw;

    @ManyToOne
    @JoinColumn(name = "st_card_id")
    private UserCard st;

    @ManyToOne
    @JoinColumn(name = "rw_card_id")
    private UserCard rw;

    @ManyToOne
    @JoinColumn(name = "cm1_card_id")
    private UserCard cm1;

    @ManyToOne
    @JoinColumn(name = "cm2_card_id")
    private UserCard cm2;

    @ManyToOne
    @JoinColumn(name = "cm3_card_id")
    private UserCard cm3;

    @ManyToOne
    @JoinColumn(name = "lb_card_id")
    private UserCard lb;

    @ManyToOne
    @JoinColumn(name = "cb1_card_id")
    private UserCard cb1;

    @ManyToOne
    @JoinColumn(name = "cb2_card_id")
    private UserCard cb2;

    @ManyToOne
    @JoinColumn(name = "rb_card_id")
    private UserCard rb;

    @ManyToOne
    @JoinColumn(name = "gk_card_id")
    private UserCard gk;

    @ManyToMany
    @JoinTable(
            name = "active_team_cards",
            joinColumns = @JoinColumn(name = "active_team_id"),
            inverseJoinColumns = @JoinColumn(name = "user_card_id")
    )
    private List<UserCard> players;


    public int getTeamRating() {
        int total = 0;
        int count = 0;

        UserCard[] cards = {lw, st, rw, cm1, cm2, cm3, lb, cb1, cb2, rb, gk};

        for (UserCard card : cards) {
            if (card != null && card.getPlayer() != null) {
                total += card.getPlayer().getRating();
                count++;
            }
        }

        return count == 0 ? 0 : total / count;
    }
}
