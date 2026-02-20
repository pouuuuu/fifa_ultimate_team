package com.bss.fut.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class CardTypeConverter implements AttributeConverter<CardType, String> {

    @Override
    public String convertToDatabaseColumn(CardType cardType) {
        if (cardType == null) {
            return null;
        }
        return cardType.getValue();
    }

    @Override
    public CardType convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        return CardType.fromValue(dbData);
    }
}