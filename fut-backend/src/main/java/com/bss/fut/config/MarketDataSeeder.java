package com.bss.fut.config;

import com.bss.fut.model.Player;
import com.bss.fut.model.User;
import com.bss.fut.model.UserCard;
import com.bss.fut.repository.PlayerRepository;
import com.bss.fut.repository.UserCardRepository;
import com.bss.fut.repository.UserRepository;
import com.bss.fut.service.MarketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MarketDataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private UserCardRepository userCardRepository;

    @Autowired
    private MarketService marketService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println("Création des données de test pour le marché...");

        User seller = new User();
        seller.setUsername("vendeur_test");
        seller.setPassword(passwordEncoder.encode("1234"));
        seller.setCoins(1000);
        userRepository.save(seller);

        User buyer = new User();
        buyer.setUsername("acheteur_test");
        buyer.setPassword(passwordEncoder.encode("1234"));
        buyer.setCoins(50000);
        userRepository.save(buyer);

        List<Player> availablePlayers = playerRepository.findAll();
        if (availablePlayers.size() < 20) {
            System.out.println("Erreur : Il faut au moins 20 joueurs en BDD pour ce script.");
            return;
        }

        for (int i = 0; i < 10; i++) {
            UserCard card = new UserCard();
            card.setOwner(seller);
            card.setPlayer(availablePlayers.get(i));
            card = userCardRepository.save(card);

            if (i < 6) {
                int price = 500 + (i * 1500);
                marketService.createListing(seller.getId(), card.getId(), price);
            }
        }

        for (int i = 10; i < 20; i++) {
            UserCard card = new UserCard();
            card.setOwner(buyer);
            card.setPlayer(availablePlayers.get(i));
            card = userCardRepository.save(card);

            if (i < 14) {
                int price = 1000 + ((i - 10) * 800);
                marketService.createListing(buyer.getId(), card.getId(), price);
            }
        }

        System.out.println("Données de test initialisées avec succès !");
    }
}