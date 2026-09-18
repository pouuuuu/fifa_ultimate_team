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
import java.util.Random;

@Service
public class PackService {

    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserCardRepository userCardRepository;

    @Transactional
    public PackResponseDTO openPack(Long userId, String packType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        int cost = getPackCost(packType);

        if (user.getCoins() < cost) {
            throw new RuntimeException("Crédits insuffisants");
        }

        user.setCoins(user.getCoins() - cost);
        userRepository.save(user);

        List<Player> packContent = new ArrayList<>();

        for (int i = 0; i < 4; i++) {
            Player p = drawPlayerForPack(packType);
            packContent.add(p);

            UserCard uc = new UserCard();
            uc.setOwner(user);
            uc.setPlayer(p);
            userCardRepository.save(uc);
        }

        return new PackResponseDTO(packContent, cost, user.getCoins());
    }

    private int getPackCost(String packType) {
        switch (packType.toLowerCase()) {
            case "bronze": return 1000;
            case "silver": return 3000;
            case "gold": return 7500;
            case "icon": return 20000;
            default: throw new IllegalArgumentException("Type de pack invalide");
        }
    }

    private Player drawPlayerForPack(String packType) {
        double rand = Math.random() * 100;
        CardType type = null;
        boolean isSpecial = false;

        switch (packType.toLowerCase()) {
            case "bronze":
                if (rand < 80) type = CardType.BRONZE;
                else if (rand < 99) type = CardType.BRONZERARE;
                else type = CardType.SILVER;
                break;
            case "silver":
                if (rand < 80) type = CardType.SILVER;
                else if (rand < 99) type = CardType.SILVERRARE;
                else type = CardType.GOLD;
                break;
            case "gold":
                if (rand < 80) type = CardType.GOLD;
                else if (rand < 99) type = CardType.GOLDRARE;
                else isSpecial = true;
                break;
            case "icon":
                isSpecial = true;
                break;
            default:
                throw new IllegalArgumentException("Type de pack invalide");
        }

        Long playerId;
        Random random = new Random();

        if (isSpecial) {
            List<Long> specialIds = playerRepository.findAllSpecialIds();
            playerId = specialIds.get(random.nextInt(specialIds.size()));
        } else {
            List<Long> ids = playerRepository.findAllIdsByCardType(type.name());
            playerId = ids.get(random.nextInt(ids.size()));
        }

        return playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Erreur de chargement du joueur."));
    }
}