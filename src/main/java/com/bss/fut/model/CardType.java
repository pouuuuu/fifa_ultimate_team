package com.bss.fut.model;

import lombok.Getter;

@Getter
public enum CardType {
    BIRTHDAY("birthday"),
    BLPOTM("blpotm"),
    BRONZE("bronze"),
    BRONZERARE("bronzerare"),
    CARNIBALL("carniball"),
    CHAMPIONSLEAGUE("championsleague"),
    CLFINAL("clfinal"),
    CONFLEAGUE("confleague"),
    ELFINAL("elfinal"),
    ELMOTM("elmotm"),
    EREDIVISIEPOTM("eredivisiepotm"),
    EUMOTM("eumotm"),
    FANTASYBLUE("fantasyblue"),
    FANTASYPURPLE("fantasypurple"),
    FGSSWAPS1("fgsswaps1"),
    FLASHBACK("flashback"),
    FUTCAPTAINS("futcaptains"),
    FUTCAPTAINSHEROES("futcaptainsheroes"),
    FUTURESTARS("futurestars"),
    FUTURESTARSTOKEN("futurestarstoken"),
    FUTHEADLINERS("futheadliners"),
    GOLD("gold"),
    GOLDBLUE("goldblue"),
    GOLDIF("goldif"),
    GOLDRARE("goldrare"),
    HALLOWEEN("halloween"),
    ICONSWAPS1("iconswaps1"),
    ICONSWAPS2("iconswaps2"),
    L1POTM("l1potm"),
    LALIGAPOTM("laligapotm"),
    LEGEND("legend"),
    MLSOBJECTIVE("mlsobjective"),
    MOTM("motm"),
    NEXTGEN("nextgen"),
    NUMBERSUP("numbersup"),
    OBJECTIVE("objective"),
    ONESTOWATCH("onestowatch"),
    PINK("pink"),
    PINKGOLD("pinkgold"),
    PLAYERMOMENTS("playermoments"),
    PLPOTM("plpotm"),
    PREMIUMSBC("premiumsbc"),
    PROMO("promo"),
    SEASON1("season1"),
    SERIEAPOTM("serieapotm"),
    SHAPESHIFTERS("shapeshifters"),
    SHOWDOWN("showdown"),
    SHOWDOWNWINNER("showdownwinner"),
    SIGNATURE("signature"),
    SILVER("silver"),
    SILVERIF("silverif"),
    SILVERRARE("silverrare"),
    SILVERSTARS("silverstars"),
    SPECIAL("special"),
    SWAP("swap"),
    SWAP2("swap2"),
    TOTGSEL("totgsel"),
    TOTSSWAPS("totsswaps"),
    TOTY("toty"),
    VERSUSFIRE("versusfire"),
    VERSUSICE("versusice"),
    WILDCARD("wildcard"),
    WILDCARDTOKEN("wildcardtoken");

    private final String value;

    CardType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static CardType fromValue(String value) {
        for (CardType type : CardType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("unknown card type: " + value);
    }

    @Override
    public String toString() {
        return value;
    }
}