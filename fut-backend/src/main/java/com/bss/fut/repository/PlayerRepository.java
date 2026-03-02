package com.bss.fut.repository;

import com.bss.fut.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long>, JpaSpecificationExecutor<Player> {
    @Query("SELECT DISTINCT p.club FROM Player p WHERE p.club IS NOT NULL ORDER BY p.club")
    List<String> findDistinctClubs();

    @Query("SELECT DISTINCT p.country FROM Player p WHERE p.country IS NOT NULL ORDER BY p.country")
    List<String> findDistinctNations();

    @Query(value = "SELECT * FROM player WHERE card_type = :type ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Player findRandomPlayerByCardType(@Param("type") String type);
}
