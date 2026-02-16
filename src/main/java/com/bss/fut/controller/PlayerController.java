package com.bss.fut.controller;

import com.bss.fut.model.Player;
import com.bss.fut.repository.PlayerRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    private final PlayerRepository playerRepository;

    public PlayerController(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    @GetMapping
    public Iterable<Player> getAllPlayers() {
        return playerRepository.findAll();
    }
}
