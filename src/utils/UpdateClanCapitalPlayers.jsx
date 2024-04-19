import React, { useState, useEffect } from "react";
import { getClanCapitalRaidSeasons, fetchClanMembersData } from "../../Services/ConnectAPI.js";

export async function updateClanCapitalRaidMembers() {
    // Obtener todos los miembros del clan
    const allMembers = await fetchClanMembersData();
    // Obtener los miembros de la temporada de asalto capital
    const raidMembers = await getClanCapitalRaidSeasons();

    // Crear un set con los tags de los miembros de la temporada de asalto capital
    const raidMemberTags = new Set(raidMembers.map(member => member.tag));

    // Agregar los miembros que faltan al listado de la temporada de asalto capital
    allMembers.forEach(member => {
        if (!raidMemberTags.has(member.tag)) {
            raidMembers.push({
                name: member.name,
                tag: member.tag,
                attacks: 0
            });
        }
    });

    // Actualizar el listado de jugadores de la temporada de asalto capital
    // Aquí puedes enviar el listado actualizado a donde necesites
    console.log("Listado de jugadores actualizado:", raidMembers);
}

export default function ClanCapitalRaidUpdater() {
    useEffect(() => {
        updateClanCapitalRaidMembers();
    }, []);

    return null; // O puedes devolver un componente vacío si prefieres
}
