const TOKEN = process.env.TOKEN;
const CLAN = process.env.CLAN;
const LEAGUEID = process.env.LEAGUEID;
const SEASONID = process.env.SEASONID;
const ARGENTINALOCATIONID = process.env.ARGENTINALOCATIONID;
const MEXICOLOCATIONID = "32000153"

const clanUrl = `https://api.clashofclans.com/api/v1/clans/${encodeURIComponent(CLAN)}`;

const headers = {
  'Accept': 'application/json',
  'authorization': `Bearer ${TOKEN}`
};

export async function getClanData() {
  try {
    const response = await fetch(clanUrl, {
      method: 'GET',
      headers: headers
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

export async function fetchClanMembersData() {
    try {
      const membersUrl = clanUrl + "/members";
      const response = await fetch(membersUrl, {
        method: 'GET',
        headers: headers
      });
  
      const data = await response.json();
      console.log("MIEMBROS", data);
      return data;
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
export async function getClanCapitalRaidSeasons() {
  try{
    const capitalUrl = clanUrl + "/capitalraidseasons";
    const response = await fetch(capitalUrl, {
      method: 'GET',
      headers: headers
    });

    const data = await response.json();
    const currentCapitalRaid = data.items[0];
    return currentCapitalRaid;
  } catch (error) {
    console.log('Error:', error);
  }
};

export async function getWarLeagueGroup() {
  try{
    const LeagueGroupUrl = clanUrl + "/currentwar/leaguegroup";
    const response = await fetch(LeagueGroupUrl, {
      method: 'GET',
      headers: headers
    });

    const data = await response.json();
    console.log("WARLOG:", data)
    return data;

  }catch(error){
    console.log('Error:', error);
  }
};

export async function getLeagueSeasonData() {
  try{
    const LeagueSeasonUrl = `/api/v1/leagues/${encodeURIComponent(LEAGUEID)}/seasons/${encodeURIComponent(SEASONID)}?limit=20`;
    console.log(LeagueSeasonUrl)
    const response = await fetch(LeagueSeasonUrl, {
      method: 'GET',
      headers: headers
    });

    const data = await response.json();
    console.log("LEAGUE SEASON:", data)
    return data;

  }catch(error){
    console.log('Error:', error);
  }
};

export async function getLocationClanRankingArg() {
  try{
    const LocationClanRankingArgURL = `/api/v1/locations/${encodeURIComponent(ARGENTINALOCATIONID)}/rankings/clans?limit=15`;
    
    const response = await fetch(LocationClanRankingArgURL, {
      method: 'GET',
      headers: headers
    });

    const data = await response.json();
    return data;

  }catch(error){
    console.log('Error:', error);
  }
};

export async function getPlayersRankingArg() {
  try{
    const PlayersRankingArgURL = `/api/v1/locations/${encodeURIComponent(ARGENTINALOCATIONID)}/rankings/players?limit=20`;
    
    const response = await fetch(PlayersRankingArgURL, {
      method: 'GET',
      headers: headers
    });

    const data = await response.json();
    return data;

  }catch(error){
    console.log('Error:', error);
  }
};

export async function getPlayersRankingMex() {
  try{
    const PlayerRankingMexURL = `/api/v1/locations/${encodeURIComponent(MEXICOLOCATIONID)}/rankings/players?limit=20`;
    
    const response = await fetch(PlayerRankingMexURL, {
      method: 'GET',
      headers: headers
    });

    const data = await response.json();
    return data;

  }catch(error){
    console.log('Error:', error);
  }
};

export async function getSinglePlayer(PLAYERTAG) {
  try{

    const playerUrl = `/api/v1/players/${encodeURIComponent(PLAYERTAG)}`;
    
    const response = await fetch(playerUrl, {
      method: 'GET',
      headers: headers
    });

    const data = await response.json();
    console.log("PLAYER:", data)
    return data;

  }catch(error){
    console.log('Error:', error);
  }
}

export async function getCurrentWarData() {
  try{

    const warDataUrl = clanUrl + "/currentwar";
    
    const response = await fetch(warDataUrl, {
      method: 'GET',
      headers: headers
    });

    const data = await response.json();
    console.log("WAR:", data)
    return data;

  }catch(error){
    console.log('Error:', error);
  }
};

getCurrentWarData();