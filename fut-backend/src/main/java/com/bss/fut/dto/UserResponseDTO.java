package com.bss.fut.dto;

public record UserResponseDTO(
        Long id,
        String username,
        int coins
) {}