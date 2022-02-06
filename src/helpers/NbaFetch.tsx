
//! This file is used to fetch data from the NBA API from https://www.balldontlie.io.

//! playersHighlighted: Form field used in VidePost.tsx that uses MaterialUI Autocomplete.
//? https://material-ui.com/components/autocomplete/
//? playersHighlighted can have a max of 5 players. It will fetch from hhttps://data.nba.net/10s//prod/v1/2021/players.json.
//? playersHighlighted is used in VidePost.tsx.
//? It should combine "first_name" and "last_name" to get the full name of the player.
//TODO - Add a max of 5 players.
//* Sample JSON response from https://data.nba.net/10s//prod/v1/2021/players.json
// {
//     "data":[
//         {
//         "id":237,
//         "first_name":"LeBron",
//         "last_name":"James",
//         "position":"F",
//         "height_feet": 6,
//         "height_inches": 8,
//         "weight_pounds": 250,
//         "team":{
//             "id":14,
//             "abbreviation":"LAL",
//             "city":"Los Angeles",
//             "conference":"West",
//             "division":"Pacific",
//             "full_name":"Los Angeles Lakers",
//             "name":"Lakers"
//         }
//        }
//         ...
//     ],
//     "meta": {
//         "total_pages": 50,
//         "current_page": 1,
//         "next_page": 2,
//         "per_page": 25,
//         "total_count": 9999
//     }
//   }

//?  playersHighlighted fetch is below:

export interface teamsArrayProps {
    teamId: number;
    teamName: string;
    city: string;
    nickname: string;
    tricode: string;
    isNBAFranchise: boolean;
    confName: string;
}

export const teamsArray: teamsArrayProps[] = [
    {
        teamId: 1,
        teamName: "Atlanta Hawks",
        city: "Atlanta",
        nickname: "Hawks",
        tricode: "ATL",
        isNBAFranchise: true,
        confName: "East",
    },
    {
        teamId: 2,
        teamName: "Boston Celtics",
        city: "Boston",
        nickname: "Celtics",
        tricode: "BOS",
        isNBAFranchise: true,
        confName: "East",
        },
    {
        teamId: 3,
        teamName: "Brooklyn Nets",
        city: "Brooklyn",
        nickname: "Nets",
        tricode: "BKN",
        isNBAFranchise: true,
        confName: "East",
    },
    {
        teamId: 4,
        teamName: "Charlotte Hornets",
        city: "Charlotte",
        nickname: "Hornets",
        tricode: "CHA",
        isNBAFranchise: true,
        confName: "East",
    },
    {
        teamId: 5,
        teamName: "Chicago Bulls",
        city: "Chicago",
        nickname: "Bulls",
        tricode: "CHI",
        isNBAFranchise: true,
        confName: "East",
    },
    {
        teamId: 6,
        teamName: "Cleveland Cavaliers",
        city: "Cleveland",
        nickname: "Cavaliers",
        tricode: "CLE",
        isNBAFranchise: true,
        confName: "East",
    },
        {
            teamId: 7,
            teamName: "Dallas Mavericks",
            city: "Dallas",
            nickname: "Mavericks",
            tricode: "DAL",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 8,
            teamName: "Denver Nuggets",
            city: "Denver",
            nickname: "Nuggets",
            tricode: "DEN",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 9,
            teamName: "Detroit Pistons",
            city: "Detroit",
            nickname: "Pistons",
            tricode: "DET",
            isNBAFranchise: true,
            confName: "East"
    },
        {
            teamId: 10,
            teamName: "Golden State Warriors",
            city: "Golden State",
            nickname: "Warriors",
            tricode: "GSW",
            isNBAFranchise: true,
            confName: "West"
        },
        {
            teamId: 11,
            teamName: "Houston Rockets",
            city: "Houston",
            nickname: "Rockets",
            tricode: "HOU",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 12,
            teamName: "Indiana Pacers",
            city: "Indiana",
            nickname: "Pacers",
            tricode: "IND",
            isNBAFranchise: true,
            confName: "East"
    },
        {
            teamId: 13,
            teamName: "Los Angeles Clippers",
            city: "LA",
            nickname: "Clippers",
            tricode: "LAC",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 14,
            teamName: "Los Angeles Lakers",
            city: "Los Angeles",
            nickname: "Lakers",
            tricode: "LAL",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 15,
            teamName: "Memphis Grizzlies",
            city: "Memphis",
            nickname: "Grizzlies",
            tricode: "MEM",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 16,
            teamName: "Miami Heat",
            city: "Miami",
            nickname: "Heat",
            tricode: "MIA",
            isNBAFranchise: true,
            confName: "East"
    },
        {
            teamId: 17,
            teamName: "Milwaukee Bucks",
            city: "Milwaukee",
            nickname: "Bucks",
            tricode: "MIL",
            isNBAFranchise: true,
            confName: "East"
        },
        {
            teamId: 18,
            teamName: "Minnesota Timberwolves",
            city: "Minnesota",
            nickname: "Timberwolves",
            tricode: "MIN",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 19,
            teamName: "New Orleans Pelicans",
            city: "New Orleans",
            nickname: "Pelicans",
            tricode: "NOP",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 20,
            teamName: "New York Knicks",
            city: "New York",
            nickname: "Knicks",
            tricode: "NYK",
            isNBAFranchise: true,
            confName: "East"
    },
        {
            teamId: 21,
            teamName: "Oklahoma City Thunder",
            city: "Oklahoma City",
            nickname: "Thunder",
            tricode: "OKC",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 22,
            teamName: "Orlando Magic",
            city: "Orlando",
            nickname: "Magic",
            tricode: "ORL",
            isNBAFranchise: true,
            confName: "East"
    },
        {
            teamId: 23,
            teamName: "Philadelphia 76ers",
            city: "Philadelphia",
            nickname: "76ers",
            tricode: "PHI",
            isNBAFranchise: true,
            confName: "East"
        },
        {
            teamId: 24,
            teamName: "Phoenix Suns",

            city: "Phoenix",
            nickname: "Suns",
            tricode: "PHX",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 25,
            teamName: "Portland Trail Blazers",
            city: "Portland",
            nickname: "Trail Blazers",
            tricode: "POR",
            isNBAFranchise: true,
            confName: "West"
        },
        {
            teamId: 26,
            teamName: "Sacramento Kings",
            city: "Sacramento",
            nickname: "Kings",
            tricode: "SAC",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 27,
            teamName: "San Antonio Spurs",
            city: "San Antonio",
            nickname: "Spurs",
            tricode: "SAS",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 28,
            teamName: "Toronto Raptors",
            city: "Toronto",
            nickname: "Raptors",
            tricode: "TOR",
            isNBAFranchise: true,
            confName: "East"
    },
        {
            teamId: 29,
            teamName: "Utah Jazz",
            city: "Utah",
            nickname: "Jazz",
            tricode: "UTA",
            isNBAFranchise: true,
            confName: "West"
    },
        {
            teamId: 30,
            teamName: "Washington Wizards",
            city: "Washington",
            nickname: "Wizards",
            tricode: "WAS",
            isNBAFranchise: true,
            confName: "East"
        },
        {
            teamId: 31,
            teamName: "All Star West",
            city: "All Star",
            nickname: "West",
            tricode: "ASW",
            isNBAFranchise: false,
            confName: "West"
        },
        {
            teamId: 32,
            teamName: "All Star East",
            city: "All Star",
            nickname: "East",
            tricode: "ASE",
            isNBAFranchise: false,
            confName: "East"
        },
        {
            teamId: 33,
            teamName: "Team LeBron",
            city: "Team",
            nickname: "LeBron",
            tricode: "TLE",
            isNBAFranchise: false,
            confName: "East"
        },
        {
            teamId: 34,
            teamName: "Team Stephen",
            city: "Team",
            nickname: "Stephen",
            tricode: "TSW",
            isNBAFranchise: false,
            confName: "West"
        },
        {
            teamId: 35,
            teamName: "Giannis",
            city: "Team",
            nickname: "Giannis",
            tricode: "TGE",
            isNBAFranchise: false,
            confName: "East"
        },
        {
            teamId: 36,
            teamName: "Team Durant",
            city: "Team",
            nickname: "Durant",
            tricode: "TDE",
            isNBAFranchise: false,
            confName: "East"
        }
    ]
