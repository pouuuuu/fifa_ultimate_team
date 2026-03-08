package com.bss.fut.controller;

import com.bss.fut.dto.MarketListingDTO;
import com.bss.fut.model.MarketListing;
import com.bss.fut.service.MarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    @Autowired
    private MarketService marketService;
    @Autowired
    private com.bss.fut.repository.MarketListingRepository marketListingRepository;

    @GetMapping("/listings")
    public List<MarketListingDTO> getActiveListings() {
        List<MarketListing> listings = marketListingRepository.findAllByActiveTrueOrderByCreatedAtDesc();

        return listings.stream().map(listing -> new MarketListingDTO(
                listing.getId(),
                listing.getPrice(),
                listing.getSeller().getUsername(),
                listing.getUserCard().getId(),
                listing.getUserCard().getPlayer(),
                listing.getCreatedAt()
        )).collect(Collectors.toList());
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sellCard(@RequestParam Long sellerId, @RequestParam Long userCardId, @RequestParam int price) {
        try {
            MarketListing listing = marketService.createListing(sellerId, userCardId, price);
            return ResponseEntity.ok(listing);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/buy")
    public ResponseEntity<?> buyCard(@RequestParam Long buyerId, @RequestParam Long listingId) {
        try {
            marketService.buyListing(buyerId, listingId);
            return ResponseEntity.ok("Achat réussi");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelListing(@RequestParam Long listingId) {
        try {
            marketService.cancelListing(listingId);
            return ResponseEntity.ok("Annonce retirée");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/update-price")
    public ResponseEntity<?> updatePrice(@RequestParam Long listingId, @RequestParam int newPrice) {
        try {
            marketService.updatePrice(listingId, newPrice);
            return ResponseEntity.ok("Prix mis à jour");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}