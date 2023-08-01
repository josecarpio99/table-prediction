import teamsData from './teams.json'

export const teams = () => {
  const data = teamsData

  function getByLeague(league) {
    return data.filter(item => item.league === league);
  }

  return {getByLeague}
}