package com.bss.fut.service;

import com.bss.fut.model.CardType;
import com.bss.fut.model.Player;
import com.bss.fut.repository.PlayerRepository;
import com.bss.fut.spec.PlayerSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    public Page<Player> searchPlayers(String name, String club, String nation, CardType cardType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Player> spec = PlayerSpecification.filterBy(name, club, nation, cardType);

        return playerRepository.findAll(spec, pageable);
    }
}
