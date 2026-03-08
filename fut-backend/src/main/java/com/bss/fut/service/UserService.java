package com.bss.fut.service;

import com.bss.fut.dto.AuthRequestDTO;
import com.bss.fut.dto.UserResponseDTO;
import com.bss.fut.model.User;
import com.bss.fut.model.UserCard;
import com.bss.fut.repository.UserCardRepository;
import com.bss.fut.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserCardRepository userCardRepository;

    public UserResponseDTO register(AuthRequestDTO request) {
        if (userRepository.findByUsername(request.username()).isPresent()) {
            throw new RuntimeException("Ce nom d'utilisateur est déjà pris.");
        }

        User newUser = new User();
        newUser.setUsername(request.username());
        // Hachage du mot de passe avant sauvegarde
        newUser.setPassword(passwordEncoder.encode(request.password()));
        newUser.setCoins(10000); // Solde de départ

        User savedUser = userRepository.save(newUser);

        return new UserResponseDTO(savedUser.getId(), savedUser.getUsername(), savedUser.getCoins());
    }

    public UserResponseDTO login(AuthRequestDTO request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé."));

        // Comparaison du mot de passe envoyé avec le hash en base de données
        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect.");
        }

        return new UserResponseDTO(user.getId(), user.getUsername(), user.getCoins());
    }

    public List<UserCard> getUserCards(Long userId) {
        return userCardRepository.findByOwnerId(userId);
    }
}