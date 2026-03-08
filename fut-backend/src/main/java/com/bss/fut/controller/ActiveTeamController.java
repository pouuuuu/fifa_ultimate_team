package com.bss.fut.controller;

import com.bss.fut.model.ActiveTeam;
import com.bss.fut.model.FieldPlayer;
import com.bss.fut.model.Player;
import com.bss.fut.model.Position;
import com.bss.fut.model.UserCard;
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
    public ResponseEntity<?> updateTeam(@PathVariable Long userId, @RequestBody Map<Position, Long> playerPositions) {
        if (playerPositions.size() > 11) {
            return ResponseEntity.badRequest().body("Erreur : Une équipe ne peut pas avoir plus de 11 joueurs.");
        }

        ActiveTeam team = activeTeamRepository.findByUserId(userId).orElseGet(() -> {
            ActiveTeam newTeam = new ActiveTeam();
            userRepository.findById(userId).ifPresent(newTeam::setUser);
            return newTeam;
        });

        ArrayList<UserCard> newStarters = new ArrayList<>();

        for (Map.Entry<Position, Long> entry : playerPositions.entrySet()) {
            Position targetPosition = entry.getKey();
            Long cardId = entry.getValue();

            UserCard card = userCardRepository.findById(cardId).orElse(null);

            if (card != null) {
                Player player = card.getPlayer();

                if (player instanceof FieldPlayer) {
                    FieldPlayer fieldPlayer = (FieldPlayer) player;

                    if (fieldPlayer.getPosition() != targetPosition) {
                        return ResponseEntity.badRequest().body(
                                "Erreur : " + player.getName() + " est un " + fieldPlayer.getPosition() +
                                        " et ne peut pas être placé en " + targetPosition
                        );
                    }
                }

                newStarters.add(card);
            }
        }

        team.setPlayers(newStarters);
        return ResponseEntity.ok(activeTeamRepository.save(team));
    }

    @GetMapping("/{userId}/cards")
    public ResponseEntity<List<UserCard>> getAvailableCards(@PathVariable Long userId) {
        return ResponseEntity.ok(userCardRepository.findByOwnerId(userId));
    }
}