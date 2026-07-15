const API_URL = import.meta.env.VITE_API_URL;

const headers = {
  Accept: 'application/json',
};

async function getJSON(path) {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // El backend devuelve { error: "..." } cuando algo falla
      console.error('Error de la API:', data.error || data);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error de conexión con el backend:', error);
    return null;
  }
}

export async function getClanData() {
  return getJSON('/clan');
}

export async function fetchClanMembersData() {
  const data = await getJSON('/clan/members');
  console.log('MIEMBROS', data);
  return data;
}

export async function getClanCapitalRaidSeasons() {
  // El backend ya devuelve directamente el item más reciente (no el array completo)
  return getJSON('/clan/capital-raids');
}

export async function getWarLeagueGroup() {
  const data = await getJSON('/clan/war-league-group');
  console.log('WARLOG:', data);
  return data;
}

export async function getLeagueSeasonData() {
  const data = await getJSON('/league/season');
  console.log('LEAGUE SEASON:', data);
  return data;
}

export async function getLocationClanRankingArg() {
  return getJSON('/rankings/clans/ar');
}

export async function getPlayersRankingArg() {
  return getJSON('/rankings/players/ar');
}

export async function getPlayersRankingMex() {
  return getJSON('/rankings/players/mx');
}

export async function getSinglePlayer(PLAYERTAG) {
  // El tag va SIN el "#" en la URL (el backend se lo vuelve a agregar).
  // Si PLAYERTAG viene con "#", se lo sacamos acá para no romper la ruta.
  const cleanTag = PLAYERTAG.startsWith('#') ? PLAYERTAG.slice(1) : PLAYERTAG;
  const data = await getJSON(`/players/${encodeURIComponent(cleanTag)}`);
  console.log('PLAYER:', data);
  return data;
}

export async function getCurrentWarData() {
  const data = await getJSON('/clan/current-war');
  console.log('WAR:', data);
  return data;
}