package com.bss.fut.config;

import com.bss.fut.model.CardType;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class StringToCardTypeConverter implements Converter<String, CardType> {

    @Override
    public CardType convert(String source) {
        if (source == null || source.isBlank()) {
            return null;
        }
        return CardType.fromValue(source);
    }
}