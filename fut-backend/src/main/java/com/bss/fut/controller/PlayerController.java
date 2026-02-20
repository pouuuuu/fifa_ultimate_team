package com.bss.fut.controller;

import com.bss.fut.model.Goalkeeper;
import com.bss.fut.model.Player;
import com.bss.fut.repository.GoalkeeperRepository;
import com.bss.fut.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @GetMapping
    public Iterable<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    @GetMapping("{id}")
    public Player getOnePlayer(@PathVariable Long id) {
        return playerRepository.findById(id).orElseThrow(() -> new RuntimeException("No player with id: " + id));
    }
}
