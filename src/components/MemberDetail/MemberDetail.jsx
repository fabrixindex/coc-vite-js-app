import React, { useState } from "react";
import "./MemberDetail.css";

const ROLE_LABELS = {
    leader: "Líder",
    coLeader: "Co-líder",
    admin: "Veterano",
    member: "Miembro",
};

const getTownHallImage = (level) => {
    if (level === 18) return "/th18.png";
    if (level === 17) return "/th17.png";
    return null;
};

const computeCompletion = (items, predicate) => {
    const filtered = (items || []).filter(predicate);
    if (filtered.length === 0) return { total: 0, maxed: 0, percentage: 0 };
    const maxed = filtered.filter((item) => item.level === item.maxLevel).length;
    return { total: filtered.length, maxed, percentage: (maxed / filtered.length) * 100 };
};

function MemberDetail({ member }) {
    const [copied, setCopied] = useState(false);
    const [visibleAchievements, setVisibleAchievements] = useState(5);

    if (!member) {
        return <div className="member-detail-error">No se pudo cargar la información del jugador.</div>;
    }

    const copyTag = () => {
        navigator.clipboard.writeText(member.tag).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }).catch((error) => {
            console.error('Error al copiar al portapapeles:', error);
        });
    };

    const roleLabel = ROLE_LABELS[member.role] || member.role || "—";
    const warPreferenceLabel = member.warPreference === "in"
        ? "Disponible para guerra"
        : "No disponible para guerra";

    const townHallImage = getTownHallImage(member.townHallLevel);

    // ---- Donaciones ----
    const donated = Number(member.donations) || 0;
    const received = Number(member.donationsReceived) || 0;
    const donationRatio = received === 0 ? (donated > 0 ? Infinity : 1) : donated / received;
    const maxDonationValue = Math.max(donated, received, 1);

    // ---- Héroes ----
    const homeHeroes = (member.heroes || []).filter((h) => h.village === "home");
    const builderHeroes = (member.heroes || []).filter((h) => h.village === "builderBase");

    // ---- Progreso general (tropas, hechizos, equipo) ----
    const homeTroops = computeCompletion(member.troops, (t) => t.village === "home");
    const builderTroops = computeCompletion(member.troops, (t) => t.village === "builderBase");
    const spellsCompletion = computeCompletion(member.spells, () => true);
    const equipmentCompletion = computeCompletion(member.heroEquipment, () => true);

    // ---- Logros ----
    const achievements = member.achievements || [];
    const totalAchievementStars = achievements.reduce((sum, a) => sum + (a.stars || 0), 0);
    const maxAchievementStars = achievements.length * 3;
    const completedAchievements = achievements.filter((a) => a.stars === 3).length;

    const incompleteAchievements = [...achievements]
        .filter((a) => a.stars < 3)
        .sort((a, b) => {
            const progressA = a.target > 0 ? a.value / a.target : 0;
            const progressB = b.target > 0 ? b.value / b.target : 0;
            return progressB - progressA;
        });

    const handleShowMoreAchievements = () => setVisibleAchievements((prev) => prev + 5);
    const handleShowLessAchievements = () => setVisibleAchievements((prev) => Math.max(5, prev - 5));

    return (
        <div className="member-detail-page">

            {/* ---------- Encabezado ---------- */}
            <div className="member-hero">
                <div className="member-hero-top">
                    {member.clan?.badgeUrls?.medium && (
                        <img src={member.clan.badgeUrls.medium} alt="Clan" className="member-hero-clan-badge" />
                    )}

                    <div className="member-hero-titles">
                        <h1 className="member-hero-name">{member.name}</h1>
                        <button className="member-hero-tag" onClick={copyTag}>
                            {copied ? "¡Copiado! ✅" : `${member.tag} 📋`}
                        </button>
                    </div>

                    {member.leagueTier?.iconUrls?.large && (
                        <img src={member.leagueTier.iconUrls.large} alt="Liga" className="member-hero-league-badge" />
                    )}
                </div>

                <div className="member-hero-chips">
                    <span className="member-chip">👑 {roleLabel}</span>
                    <span className="member-chip">⭐ Nivel de experiencia {member.expLevel}</span>
                    <span className="member-chip">⚔️ {warPreferenceLabel}</span>
                    {member.clan?.name && <span className="member-chip">🛡️ {member.clan.name}</span>}
                    {member.leagueTier?.name && <span className="member-chip">🏆 {member.leagueTier.name}</span>}
                </div>
            </div>

            {/* ---------- Estadísticas principales ---------- */}
            <div className="member-section">
                <h2 className="member-section-title">📊 Estadísticas principales</h2>

                <div className="member-stats-grid">
                    <div className="member-stat-chip">
                        {townHallImage && <img src={townHallImage} alt="Ayuntamiento" className="member-stat-chip-icon" />}
                        <span className="member-stat-chip-label">Ayuntamiento</span>
                        <span className="member-stat-chip-value">{member.townHallLevel}</span>
                    </div>
                    <div className="member-stat-chip">
                        <span className="member-stat-chip-label">Trofeos actuales</span>
                        <span className="member-stat-chip-value">{member.trophies?.toLocaleString()}</span>
                    </div>
                    <div className="member-stat-chip">
                        <span className="member-stat-chip-label">Mejores trofeos</span>
                        <span className="member-stat-chip-value">{member.bestTrophies?.toLocaleString()}</span>
                    </div>
                    <div className="member-stat-chip">
                        <span className="member-stat-chip-label">Estrellas de guerra</span>
                        <span className="member-stat-chip-value">{member.warStars?.toLocaleString()}</span>
                    </div>
                    <div className="member-stat-chip">
                        <span className="member-stat-chip-label">Ataques ganados</span>
                        <span className="member-stat-chip-value">{member.attackWins?.toLocaleString()}</span>
                    </div>
                    <div className="member-stat-chip">
                        <span className="member-stat-chip-label">Defensas ganadas</span>
                        <span className="member-stat-chip-value">{member.defenseWins?.toLocaleString()}</span>
                    </div>
                    <div className="member-stat-chip">
                        <span className="member-stat-chip-label">Aporte a la capital</span>
                        <span className="member-stat-chip-value">{member.clanCapitalContributions?.toLocaleString()}</span>
                    </div>
                    {member.builderHallLevel > 0 && (
                        <>
                            <div className="member-stat-chip">
                                <span className="member-stat-chip-label">Ayuntamiento de constructor</span>
                                <span className="member-stat-chip-value">{member.builderHallLevel}</span>
                            </div>
                            <div className="member-stat-chip">
                                <span className="member-stat-chip-label">Trofeos de constructor</span>
                                <span className="member-stat-chip-value">{member.builderBaseTrophies?.toLocaleString()}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ---------- Donaciones ---------- */}
            <div className="member-section">
                <h2 className="member-section-title">🤝 Donaciones</h2>

                <div className="member-donation-bars">
                    <div className="member-bar-row">
                        <span className="member-bar-label">Donado</span>
                        <div className="member-bar-track">
                            <div className="member-bar-fill member-bar-fill--given" style={{ width: `${(donated / maxDonationValue) * 100}%` }} />
                        </div>
                        <span className="member-bar-value">{donated}</span>
                    </div>
                    <div className="member-bar-row">
                        <span className="member-bar-label">Recibido</span>
                        <div className="member-bar-track">
                            <div className="member-bar-fill member-bar-fill--received" style={{ width: `${(received / maxDonationValue) * 100}%` }} />
                        </div>
                        <span className="member-bar-value">{received}</span>
                    </div>
                </div>

                <p className="member-donation-ratio">
                    {donationRatio === Infinity
                        ? "Solo dona 🌟"
                        : `Dona el ${Math.round(donationRatio * 100)}% de lo que recibe`}
                </p>
            </div>

            {/* ---------- Estadísticas de Liga de Leyendas ---------- */}
            {member.legendStatistics && (
                <div className="member-section">
                    <h2 className="member-section-title">👑 Liga de Leyendas</h2>

                    <div className="member-stats-grid">
                        {member.legendStatistics.currentSeason && (
                            <div className="member-stat-chip">
                                <span className="member-stat-chip-label">Temporada actual</span>
                                <span className="member-stat-chip-value">
                                    {member.legendStatistics.currentSeason.trophies?.toLocaleString()} 🏆
                                </span>
                                <span className="member-stat-chip-sublabel">
                                    Puesto #{member.legendStatistics.currentSeason.rank?.toLocaleString()}
                                </span>
                            </div>
                        )}
                        {member.legendStatistics.bestSeason && (
                            <div className="member-stat-chip">
                                <span className="member-stat-chip-label">Mejor temporada</span>
                                <span className="member-stat-chip-value">
                                    {member.legendStatistics.bestSeason.trophies?.toLocaleString()} 🏆
                                </span>
                                <span className="member-stat-chip-sublabel">
                                    Puesto #{member.legendStatistics.bestSeason.rank?.toLocaleString()}
                                </span>
                            </div>
                        )}
                        <div className="member-stat-chip">
                            <span className="member-stat-chip-label">Trofeos de leyenda</span>
                            <span className="member-stat-chip-value">{member.legendStatistics.legendTrophies?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------- Héroes ---------- */}
            {(homeHeroes.length > 0 || builderHeroes.length > 0) && (
                <div className="member-section">
                    <h2 className="member-section-title">🦸 Héroes</h2>

                    {homeHeroes.length > 0 && (
                        <>
                            <p className="member-subsection-label">Aldea principal</p>
                            <div className="member-hero-bars">
                                {homeHeroes.map((hero) => (
                                    <div key={hero.name} className="member-bar-row">
                                        <span className="member-bar-label">{hero.name}</span>
                                        <div className="member-bar-track">
                                            <div
                                                className="member-bar-fill member-bar-fill--hero"
                                                style={{ width: `${(hero.level / hero.maxLevel) * 100}%` }}
                                            />
                                        </div>
                                        <span className="member-bar-value">{hero.level}/{hero.maxLevel}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {builderHeroes.length > 0 && (
                        <>
                            <p className="member-subsection-label">Aldea de constructor</p>
                            <div className="member-hero-bars">
                                {builderHeroes.map((hero) => (
                                    <div key={hero.name} className="member-bar-row">
                                        <span className="member-bar-label">{hero.name}</span>
                                        <div className="member-bar-track">
                                            <div
                                                className="member-bar-fill member-bar-fill--hero"
                                                style={{ width: `${(hero.level / hero.maxLevel) * 100}%` }}
                                            />
                                        </div>
                                        <span className="member-bar-value">{hero.level}/{hero.maxLevel}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* ---------- Progreso general ---------- */}
            <div className="member-section">
                <h2 className="member-section-title">📈 Progreso general</h2>

                <div className="member-progress-grid">
                    <div className="member-progress-chip">
                        <span className="member-progress-chip-value">{homeTroops.maxed}/{homeTroops.total}</span>
                        <span className="member-progress-chip-label">Tropas al máximo</span>
                        <div className="member-progress-chip-track">
                            <div className="member-progress-chip-fill" style={{ width: `${homeTroops.percentage}%` }} />
                        </div>
                    </div>

                    {builderTroops.total > 0 && (
                        <div className="member-progress-chip">
                            <span className="member-progress-chip-value">{builderTroops.maxed}/{builderTroops.total}</span>
                            <span className="member-progress-chip-label">Tropas de constructor al máximo</span>
                            <div className="member-progress-chip-track">
                                <div className="member-progress-chip-fill" style={{ width: `${builderTroops.percentage}%` }} />
                            </div>
                        </div>
                    )}

                    <div className="member-progress-chip">
                        <span className="member-progress-chip-value">{spellsCompletion.maxed}/{spellsCompletion.total}</span>
                        <span className="member-progress-chip-label">Hechizos al máximo</span>
                        <div className="member-progress-chip-track">
                            <div className="member-progress-chip-fill" style={{ width: `${spellsCompletion.percentage}%` }} />
                        </div>
                    </div>

                    <div className="member-progress-chip">
                        <span className="member-progress-chip-value">{equipmentCompletion.maxed}/{equipmentCompletion.total}</span>
                        <span className="member-progress-chip-label">Equipo de héroe al máximo</span>
                        <div className="member-progress-chip-track">
                            <div className="member-progress-chip-fill" style={{ width: `${equipmentCompletion.percentage}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* ---------- Logros ---------- */}
            <div className="member-section">
                <h2 className="member-section-title">🏅 Logros</h2>

                <div className="member-achievements-summary">
                    <div className="member-bar-row">
                        <span className="member-bar-label">Estrellas</span>
                        <div className="member-bar-track">
                            <div
                                className="member-bar-fill member-bar-fill--achievement"
                                style={{ width: `${(totalAchievementStars / maxAchievementStars) * 100}%` }}
                            />
                        </div>
                        <span className="member-bar-value">{totalAchievementStars}/{maxAchievementStars}</span>
                    </div>
                    <p className="member-achievements-completed">✅ {completedAchievements} de {achievements.length} logros completados</p>
                </div>

                {incompleteAchievements.length === 0 ? (
                    <p className="member-achievements-empty">🎉 ¡Completó todos los logros!</p>
                ) : (
                    <>
                        <p className="member-subsection-label">Logros por completar (más cerca primero)</p>
                        <div className="member-achievements-list">
                            {incompleteAchievements.slice(0, visibleAchievements).map((achievement) => {
                                const progress = achievement.target > 0
                                    ? Math.min(100, (achievement.value / achievement.target) * 100)
                                    : 0;

                                return (
                                    <div key={achievement.name} className="member-achievement-row">
                                        <div className="member-achievement-row-header">
                                            <span className="member-achievement-name">{achievement.name}</span>
                                            <span className="member-achievement-stars">
                                                {"⭐".repeat(achievement.stars)}{"☆".repeat(3 - achievement.stars)}
                                            </span>
                                        </div>
                                        <div className="member-bar-track">
                                            <div className="member-bar-fill member-bar-fill--achievement" style={{ width: `${progress}%` }} />
                                        </div>
                                        <div className="member-achievement-row-footer">
                                            <span>{achievement.value?.toLocaleString()} / {achievement.target?.toLocaleString()}</span>
                                            <span className="member-achievement-info">{achievement.info}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="member-achievements-buttons">
                            {visibleAchievements < incompleteAchievements.length && (
                                <button onClick={handleShowMoreAchievements} className="member-btn member-btn--more">Ver más</button>
                            )}
                            {visibleAchievements > 5 && (
                                <button onClick={handleShowLessAchievements} className="member-btn member-btn--less">Ver menos</button>
                            )}
                        </div>
                    </>
                )}
            </div>

        </div>
    );
}

export default MemberDetail;
