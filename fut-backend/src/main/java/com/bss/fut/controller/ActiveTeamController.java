package com.bss.fut.controller;

import com.bss.fut.model.*;
import com.bss.fut.repository.ActiveTeamRepository;
import com.bss.fut.repository.UserCardRepository;
import com.bss.fut.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/team")
public class ActiveTeamController {

    @Autowired
    private ActiveTeamRepository activeTeamRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCardRepository userCardRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<ActiveTeam> getActiveTeam(@PathVariable Long userId) {
        return activeTeamRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{userId}/update")
    public ResponseEntity<?> updateTeam(@PathVariable Long userId, @RequestBody Map<String, Long> playerPositions) {
        if (playerPositions.size() > 11) {
            return ResponseEntity.badRequest().body("Erreur : 11 joueurs maximum.");
        }

        ActiveTeam team = activeTeamRepository.findByUserId(userId).orElseGet(() -> {
            ActiveTeam nt = new ActiveTeam();
            userRepository.findById(userId).ifPresent(nt::setUser);
            return nt;
        });

        List<UserCard> newStarters = new ArrayList<>();

        for (Map.Entry<String, Long> entry : playerPositions.entrySet()) {
            String posKey = entry.getKey();
            UserCard card = userCardRepository.findById(entry.getValue()).orElse(null);

            if (card != null) {
                Player player = card.getPlayer();
                boolean isValid = true;

                if (posKey.equals("GK")) {
                    if (!(player instanceof Goalkeeper)) {
                        isValid = false;
                    }
                }

                if (!isValid) {
                    return ResponseEntity.badRequest().body("Position invalide pour " + player.getSurname() + " " + player.getName());
                }
                newStarters.add(card);
            }
        }

        team.setPlayers(new ArrayList<>(newStarters));
        activeTeamRepository.save(team);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/cards")
    public ResponseEntity<List<UserCard>> getAvailableCards(@PathVariable Long userId) {
        return ResponseEntity.ok(userCardRepository.findByOwnerId(userId));
    }
}