package com.bss.fut.dto;

import com.bss.fut.model.Player;
import java.time.LocalDateTime;

public record MarketListingDTO(
        Long listingId,
        int price,
        String sellerUsername,
        Long userCardId,
        Player player,
        LocalDateTime createdAt
) {}