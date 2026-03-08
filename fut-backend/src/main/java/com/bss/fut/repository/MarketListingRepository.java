package com.bss.fut.repository;

import com.bss.fut.model.MarketListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketListingRepository extends JpaRepository<MarketListing, Long> {

    // Récupère uniquement les offres non vendues
    List<MarketListing> findAllByActiveTrueOrderByCreatedAtDesc();
}