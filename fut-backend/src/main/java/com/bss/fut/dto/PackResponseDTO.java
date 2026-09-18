package com.bss.fut.dto;

import com.bss.fut.model.Player;

import java.util.List;

public record PackResponseDTO(
        List<Player> players,
        int cost,
        int remainingCoins
) {}
