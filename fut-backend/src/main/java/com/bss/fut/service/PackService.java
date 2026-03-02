package com.bss.fut.service;

import com.bss.fut.dto.PackResponseDTO;
import com.bss.fut.model.CardType;
import com.bss.fut.model.Player;
import com.bss.fut.model.User;
import com.bss.fut.model.UserCard;
import com.bss.fut.repository.PlayerRepository;
import com.bss.fut.repository.UserCardRepository;
import com.bss.fut.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PackService {

    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserCardRepository userCardRepository;

    @Transactional
    public PackResponseDTO openGoldPack(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getCoins() < 7500) {
            throw new RuntimeException("Crédits insuffisants !");
        }

        user.setCoins(user.getCoins() - 7500);
        userRepository.save(user);

        List<Player> packContent = new ArrayList<>();

        for (int i = 0; i < 12; i++) {
            CardType type = (i == 0) ? drawRarity(true) : drawRarity(false);

            Player p = getRandomPlayerByRarity(type);
            packContent.add(p);

            UserCard uc = new UserCard();
            uc.setOwner(user);
            uc.setPlayer(p);
            userCardRepository.save(uc);
        }

        return new PackResponseDTO(packContent, 7500, user.getCoins());
    }

    private CardType drawRarity(boolean guaranteedRare) {
        double rand = Math.random() * 100;
        if (guaranteedRare) return CardType.GOLDRARE;

        if (rand < 70) return CardType.GOLD;
        if (rand < 95) return CardType.GOLDRARE;
        return CardType.LEGEND;
    }

    private Player getRandomPlayerByRarity(CardType type) {
        return playerRepository.findRandomPlayerByCardType(type.name());
    }
}
