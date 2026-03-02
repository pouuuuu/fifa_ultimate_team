package com.bss.fut.dto;

import com.bss.fut.model.CardType;

import java.util.List;

public record FilterOptionsDTO(
        List<String> clubs,
        List<String> nations,
        List<CardType> cardTypes
) {}
