package com.bss.fut.repository;

import com.bss.fut.model.Goalkeeper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoalkeeperRepository extends JpaRepository<Goalkeeper, Long> {
}
