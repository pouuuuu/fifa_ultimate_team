import { CARD_COLORS, getShortPos } from '../utils';

// The player object prop is expected to have all player attributes
// e.g., { cardType, rating, position, country, club, name, surname, pac, sho, ... }
function PlayerCard({ player }) {
    const {
        cardType, rating, position, country, club, name, surname,
        pac, sho, pas, dri, def, phy,
        div, han, kic, ref, spe, pos
    } = player;

    const isGK = div !== undefined;
    const textColor = CARD_COLORS[cardType] || '#000000'; // Fallback color
    const playerImageName = `${name} ${surname}`;
    const playerImageSrc = `/images/joueurs/${encodeURIComponent(playerImageName)}.png`;
    const cardBgSrc = `/images/fonds/${cardType}.png`;
    const countryIconSrc = `/images/pays/${country}.png`;
    const clubIconSrc = `/images/clubs/${club}.png`;

    return (
        <div className="player" style={{ color: textColor }}>
            <img
                className="card-bg"
                src={cardBgSrc}
                alt="background"
                loading="lazy"
                decoding="async"
            />

            <div className="player-master-info">
                <div className="rating">{rating}</div>
                <div className="position">{isGK ? "GK" : getShortPos(position)}</div>
                <div className="icons">
                    <img className="country" src={countryIconSrc} alt={country} loading="lazy" />
                    <img className="club" src={clubIconSrc} alt={club} loading="lazy" />
                </div>
            </div>

            <div className="player-avatar">
                <img
                    src={playerImageSrc}
                    alt={playerImageName}
                    loading="lazy"
                    decoding="async"
                />
            </div>

            <div className="player-card-bottom">
                <div className="name"><span>{surname}</span></div>
                <div className="attributs">
                    <div className="stat-col">
                        <span>{isGK ? div : pac} {isGK ? "DIV" : "PAC"}</span>
                        <span>{isGK ? han : sho} {isGK ? "HAN" : "SHO"}</span>
                        <span>{isGK ? kic : pas} {isGK ? "KIC" : "PAS"}</span>
                    </div>
                    <div className="stat-col">
                        <span>{isGK ? ref : dri} {isGK ? "REF" : "DRI"}</span>
                        <span>{isGK ? spe : def} {isGK ? "SPE" : "DEF"}</span>
                        <span>{isGK ? pos : phy} {isGK ? "POS" : "PHY"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerCard;