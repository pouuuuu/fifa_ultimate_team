package com.bss.fut.controller;

import com.bss.fut.model.CardType;
import com.bss.fut.model.Player;
import com.bss.fut.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @GetMapping("/search")
    public Page<Player> search(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String club,
            @RequestParam(required = false) String nation,
            @RequestParam(required = false) CardType cardType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return playerService.searchPlayers(name, club, nation, cardType, page, size);
    }
}
