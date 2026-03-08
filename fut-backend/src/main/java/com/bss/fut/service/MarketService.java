package com.bss.fut.service;

import com.bss.fut.model.MarketListing;
import com.bss.fut.model.User;
import com.bss.fut.model.UserCard;
import com.bss.fut.repository.MarketListingRepository;
import com.bss.fut.repository.UserCardRepository;
import com.bss.fut.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MarketService {

    @Autowired
    private MarketListingRepository marketListingRepository;
    @Autowired
    private UserCardRepository userCardRepository;
    @Autowired
    private UserRepository userRepository;

    @Transactional
    public MarketListing createListing(Long sellerId, Long userCardId, int price) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Vendeur introuvable"));

        UserCard card = userCardRepository.findById(userCardId)
                .orElseThrow(() -> new RuntimeException("Carte introuvable"));

        if (!card.getOwner().getId().equals(sellerId)) {
            throw new RuntimeException("Vous ne possédez pas cette carte");
        }

        card.setTradeable(false);
        userCardRepository.save(card);

        MarketListing listing = new MarketListing();
        listing.setSeller(seller);
        listing.setUserCard(card);
        listing.setPrice(price);

        return marketListingRepository.save(listing);
    }

    @Transactional
    public void buyListing(Long buyerId, Long listingId) {
        MarketListing listing = marketListingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Offre introuvable"));

        if (!listing.isActive()) {
            throw new RuntimeException("Cette carte a déjà été vendue");
        }

        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new RuntimeException("Acheteur introuvable"));

        User seller = listing.getSeller();

        if (buyer.getId().equals(seller.getId())) {
            throw new RuntimeException("Vous ne pouvez pas acheter votre propre carte");
        }

        if (buyer.getCoins() < listing.getPrice()) {
            throw new RuntimeException("Crédits insuffisants");
        }

        buyer.setCoins(buyer.getCoins() - listing.getPrice());
        seller.setCoins(seller.getCoins() + listing.getPrice());

        UserCard card = listing.getUserCard();
        card.setOwner(buyer);
        card.setTradeable(true);

        listing.setActive(false);

        userRepository.save(buyer);
        userRepository.save(seller);
        userCardRepository.save(card);
        marketListingRepository.save(listing);
    }

    @Transactional
    public void cancelListing(Long listingId) {
        MarketListing listing = marketListingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Offre introuvable"));

        UserCard card = listing.getUserCard();
        card.setTradeable(true);
        userCardRepository.save(card);

        marketListingRepository.delete(listing);
    }

    @Transactional
    public void updatePrice(Long listingId, int newPrice) {
        MarketListing listing = marketListingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Offre introuvable"));

        if (newPrice <= 0) throw new RuntimeException("Le prix doit être positif");

        listing.setPrice(newPrice);
        marketListingRepository.save(listing);
    }
}