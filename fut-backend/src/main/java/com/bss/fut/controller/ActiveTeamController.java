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

        List<Long> cardIds = new ArrayList<>(playerPositions.values());
        long distinctCount = cardIds.stream().distinct().count();
        if (distinctCount != cardIds.size()) {
            return ResponseEntity.badRequest().body("Un même joueur ne peut pas figurer deux fois dans l'équipe.");
        }

        ActiveTeam team = activeTeamRepository.findByUserId(userId).orElseGet(() -> {
            ActiveTeam nt = new ActiveTeam();
            userRepository.findById(userId).ifPresent(nt::setUser);
            return nt;
        });

        // Réinitialise les postes existants
        team.setLw(null);
        team.setSt(null);
        team.setRw(null);
        team.setCm1(null);
        team.setCm2(null);
        team.setCm3(null);
        team.setLb(null);
        team.setCb1(null);
        team.setCb2(null);
        team.setRb(null);
        team.setGk(null);

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

                // Affectation du joueur au bon poste (4-3-3)
                switch (posKey) {
                    case "LW" -> team.setLw(card);
                    case "ST" -> team.setSt(card);
                    case "RW" -> team.setRw(card);
                    case "CM1" -> team.setCm1(card);
                    case "CM2" -> team.setCm2(card);
                    case "CM3" -> team.setCm3(card);
                    case "LB" -> team.setLb(card);
                    case "CB1" -> team.setCb1(card);
                    case "CB2" -> team.setCb2(card);
                    case "RB" -> team.setRb(card);
                    case "GK" -> team.setGk(card);
                    default -> {
                        // Poste inconnu, on renvoie une erreur explicite
                        return ResponseEntity.badRequest().body("Poste inconnu : " + posKey);
                    }
                }

                newStarters.add(card);
            }
        }

        // Garde aussi une liste des titulaires pour compatibilité (ex: calcul de note)
        team.setPlayers(new ArrayList<>(newStarters));
        activeTeamRepository.save(team);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/cards")
    public ResponseEntity<List<UserCard>> getAvailableCards(@PathVariable Long userId) {
        return ResponseEntity.ok(userCardRepository.findByOwnerId(userId));
    }
}