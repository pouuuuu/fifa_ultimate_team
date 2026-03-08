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
        if (availablePlayers.size() < 3) {
            System.out.println("Erreur : La base de données des joueurs est vide.");
            return;
        }

        UserCard card1 = new UserCard();
        card1.setOwner(seller);
        card1.setPlayer(availablePlayers.get(0));
        userCardRepository.save(card1);

        UserCard card2 = new UserCard();
        card2.setOwner(seller);
        card2.setPlayer(availablePlayers.get(1));
        userCardRepository.save(card2);

        UserCard card3 = new UserCard();
        card3.setOwner(seller);
        card3.setPlayer(availablePlayers.get(2));
        userCardRepository.save(card3);

        marketService.createListing(seller.getId(), card1.getId(), 1500);
        marketService.createListing(seller.getId(), card2.getId(), 8500);

        System.out.println("Données de test initialisées avec succès !");
    }
}