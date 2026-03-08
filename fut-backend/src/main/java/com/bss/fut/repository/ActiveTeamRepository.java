package com.bss.fut.repository;

import com.bss.fut.model.ActiveTeam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ActiveTeamRepository extends JpaRepository<ActiveTeam, Long> {
    Optional<ActiveTeam> findByUserId(Long userId);
}