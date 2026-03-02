package com.bss.fut.repository;

import com.bss.fut.model.UserCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserCardRepository extends JpaRepository<UserCard, Long> {
    List<UserCard> findByOwnerId(Long ownerId);
}
