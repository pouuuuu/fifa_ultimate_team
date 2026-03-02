package com.bss.fut.spec;

import com.bss.fut.model.CardType;
import com.bss.fut.model.Player;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

public class PlayerSpecification {

    public static Specification<Player> filterBy(String name, String club, String nation, CardType cardType) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (name != null && !name.isBlank()) {
                String namePattern = "%" + name.toLowerCase() + "%";
                Predicate firstNameMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), namePattern);
                Predicate lastNameMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), namePattern);
                predicates.add(criteriaBuilder.or(firstNameMatch, lastNameMatch));
            }

            if (club != null && !club.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("club"), club));
            }

            if (nation != null && !nation.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("nation"), nation));
            }

            if (cardType != null) {
                predicates.add(criteriaBuilder.equal(root.get("cardType"), cardType));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}