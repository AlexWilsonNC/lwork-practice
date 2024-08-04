import regional25 from '../assets/event-logo/regionals-2025.png';
import regionals from '../assets/event-logo/regionals-hd.png';
import internats25 from '../assets/event-logo/internats-2025.png';
import speSeries from '../assets/event-logo/spe.png';
import worlds from '../assets/event-logo/worlds-hd.png';
import malaysiaChampionships from '../assets/event-logo/ch-malaysia.png';
import hongkongChampionships from '../assets/event-logo/ch-hongkong.png';
import indonesiaChampionships from '../assets/event-logo/ch-indonesia.png';
import philippenesChampionships from '../assets/event-logo/ch-philippenes.png';
import singaporeChampionships from '../assets/event-logo/ch-singapore.png';
import taiwanChampionships from '../assets/event-logo/ch-taiwan.png';
import thailandChampionships from '../assets/event-logo/ch-thailand.png';
import japanChampionships from '../assets/event-logo/jp-nationals.png';
import ogInternats from '../assets/event-logo/internats-logo.png';
import koreaLeague from '../assets/event-logo/korean-league.png';
import wotcWorlds from '../assets/event-logo/worlds-2002.png';
import worldsOten from '../assets/event-logo/2010worlds.png';
import worldsOnine from '../assets/event-logo/2009worlds.jpg';
import worldsOeight from '../assets/event-logo/2008worlds.png';
import worldsOSeven from '../assets/event-logo/2007worlds.png';
import worldsOsix from '../assets/event-logo/2006worlds.png';
import worldsOfive from '../assets/event-logo/2005worlds.png';
import worldsOfour from '../assets/event-logo/2004worlds.png';
import nationals from '../assets/event-logo/nats-logo.png';
import oldNationals from '../assets/event-logo/old-nats-logo.png';
import oFourNationals from '../assets/event-logo/nats-logo-04.png';
import retro from '../assets/event-logo/retro.png';
import stadiumChallenge from '../assets/event-logo/stadium-challenge-wotc.png';
import superTrainerShowdown from '../assets/event-logo/super-trainer-showdown-logo.png';

import argentina from '../assets/flags/argentina.png';
import australia from '../assets/flags/australia.png';
import austria from '../assets/flags/austria.png';
import belarus from '../assets/flags/belarus.png';
import belgium from '../assets/flags/belgium.png';
import brazil from '../assets/flags/brazil.png';
import canada from '../assets/flags/canada.png';
import chile from '../assets/flags/chile.png';
import china from '../assets/flags/china.png';
import colombia from '../assets/flags/colombia.png';
import croatia from '../assets/flags/croatia.png';
import czechia from '../assets/flags/czech-republic.png';
import denmark from '../assets/flags/denmark.png';
import ecuador from '../assets/flags/ecuador.png';
import elSalvador from '../assets/flags/el-salvador.png';
import finland from '../assets/flags/finland.png';
import france from '../assets/flags/france.png';
import germany from '../assets/flags/germany.png';
import hongKong from '../assets/flags/hong-kong.png';
import indonesia from '../assets/flags/indonesia.png';
import italy from '../assets/flags/italy.png';
import japan from '../assets/flags/japan.png';
import southKorea from '../assets/flags/korea.png';
import malaysia from '../assets/flags/malaysia.png';
import mexico from '../assets/flags/mexico.png';
import netherlands from '../assets/flags/netherlands.png';
import newZealand from '../assets/flags/new-zealand.png';
import norway from '../assets/flags/norway.png';
import peru from '../assets/flags/peru.png';
import philippines from '../assets/flags/philippines.png';
import poland from '../assets/flags/poland.png';
import portugal from '../assets/flags/portugal.png';
import puertoRico from '../assets/flags/puerto-rico.png';
import russia from '../assets/flags/russia.png';
import singapore from '../assets/flags/singapore.png';
import slovakia from '../assets/flags/slovakia.png';
import southAfrica from '../assets/flags/south-africa.png';
import spain from '../assets/flags/spain.png';
import sweden from '../assets/flags/sweden.png';
import switzerland from '../assets/flags/switzerland.png';
import taiwan from '../assets/flags/taiwan.png';
import thailand from '../assets/flags/thailand.png';
import usa from '../assets/flags/usa.png';
import uk from '../assets/flags/uk.png';
import unknown from '../assets/flags/unknown.png';

const tournamentList = [
    // {
    //     "id": 'event2',
    //     "name": "Malaysia Championships",
    //     "eventType": "asiachampionship",
    //     "eventLogo": malaysiaChampionships,
    //     "date": "Jun 29, 2024",
    //     "flag": usa,
    //     "location": ""
    // },
    {
        "id": '2024_NAIC/masters',
        "name": "NAIC 2024",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Jun 7, 2024",
        "flag": usa,
        "location": ""
    },
    {
        "id": '2024_NAIC_2014_RETRO/masters',
        "name": "NAIC Retro Celebration (2014)",
        "eventType": "retro",
        "eventLogo": retro,
        "date": "Jun 9, 2024",
        "flag": usa,
        "location": ""
    },
    {
        "id": '2024_NAIC_2010_RETRO/masters',
        "name": "NAIC Retro Celebration (2010)",
        "eventType": "retro",
        "eventLogo": retro,
        "date": "Jun 6, 2024",
        "flag": usa,
        "location": ""
    },
    {
        "id": '2024_WORLDS/masters',
        "name": "World Championships 2024",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 16, 2024",
        "flag": usa,
        "location": "Honolulu, Hawaii",
        "registrationTime": "2024-07-01T19:00:00-05:00",
        "registrationLink": "https://worlds.pokemon.com/en-us/",

    },
    {
        "id": '2025_BALTIMORE/masters',
        "name": "Baltimore Regionals",
        "eventType": "regional",
        "eventLogo": regional25,
        "date": "Sep 14, 2024",
        "flag": usa,
        "location": "Baltimore, Maryland",
        "registrationTime": "2024-07-31T19:00:00-05:00",
        "registrationLink": "https://rk9.gg/tournament/BA01mbRvSKoISiCU7cBJ",
    },
    {
        "id": '2025_DORTMUND/masters',
        "name": "Dortmund Regionals",
        "eventType": "regional",
        "eventLogo": regional25,
        "date": "Sep 28, 2024",
        "flag": germany,
        "location": "Dortmund, Germany",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_JOINVILLE/masters',
        "name": "Joinville Regionals",
        "eventType": "regional",
        "eventLogo": regional25,
        "date": "Sep 28, 2024",
        "flag": brazil,
        "location": "Joinville, Brazil",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_LIMA/masters',
        "name": "Lima Special Event",
        "eventType": "speSeries",
        "eventLogo": speSeries,
        "date": "Oct 5, 2024",
        "flag": peru,
        "location": "Lime, Peru",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_LOUISVILLE/masters',
        "name": "Louisville Regionals",
        "eventType": "regional",
        "eventLogo": regional25,
        "date": "Oct 11, 2024",
        "flag": usa,
        "location": "Louisville, Kentucky",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_LILLE/masters',
        "name": "Lille Regionals",
        "eventType": "regional",
        "eventLogo": regional25,
        "date": "Oct 19, 2024",
        "flag": france,
        "location": "Lille, France",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_GDASNK/masters',
        "name": "Gdańsk Regionals",
        "eventType": "regional",
        "eventLogo": regional25,
        "date": "Nov 2, 2024",
        "flag": poland,
        "location": "Gdańsk, Poland",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_BUENOS_AIRES/masters',
        "name": "Buenos Aires Special Event",
        "eventType": "speSeries",
        "eventLogo": speSeries,
        "date": "Nov 9, 2024",
        "flag": argentina,
        "location": "Buenos Aires, Argentina",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_SACRAMENTO/masters',
        "name": "Sacramento Regionals",
        "eventType": "regional",
        "eventLogo": regional25,
        "date": "Nov 22, 2024",
        "flag": usa,
        "location": "Sacramento, California",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_STUTTGART/masters',
        "name": "Stuttgart Regionals",
        "eventType": "regional",
        "eventLogo": regional25,
        "date": "Nov 30, 2024",
        "flag": germany,
        "location": "Stuttgart, Germany",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_BOGOTA/masters',
        "name": "Bogotá Special Event",
        "eventType": "speSeries",
        "eventLogo": speSeries,
        "date": "Dec 7, 2024",
        "flag": colombia,
        "location": "Bogotá, Colombia",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_TORONTO/masters',
        "name": "Toronto Regionals",
        "eventType": "regional",
        "eventLogo": regional25,
        "date": "Dec 13, 2024",
        "flag": canada,
        "location": "Toronto, Canada",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_LAIC/masters',
        "name": "LAIC 2025",
        "eventType": "international",
        "eventLogo": internats25,
        "date": "Nov 15, 2024",
        "flag": brazil,
        "location": "São Paulo, Brazil",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_EUIC/masters',
        "name": "EUIC 2025",
        "eventType": "international",
        "eventLogo": internats25,
        "date": "Feb 21, 2025",
        "flag": uk,
        "location": "London, United Kingdom",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '2025_NAIC/masters',
        "name": "NAIC 2025",
        "eventType": "international",
        "eventLogo": internats25,
        "date": "Jun 13, 2025",
        "flag": usa,
        "location": "New Orleans, Louisiana",
        "registrationTime": "",
        "registrationLink": "",
    },
    {
        "id": '/masters',
        "name": "World Championships 2025",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "TBA 2025",
        "flag": unknown,
        "location": "",
        "registrationTime": "",
        "registrationLink": "",
    },
    // {
    //     "id": '2024_BOLOGNA',
    //     "name": "Bologna Regionals",
    //     "eventType": "regionals",
    //     "eventLogo": regionals,
    //     "date": "Jun 1, 2024",
    //     "flag": italy,
    //     "location": "Bologna, Italy"
    // },
    // {
    //     "id": '2024_CAPE_TOWN',
    //     "name": "Cape Town Special Event",
    //     "eventType": "speSeries",
    //     "eventLogo": speSeries,
    //     "date": "Jun 1, 2024",
    //     "flag": southAfrica,
    //     "location": "Cape Town, South Africa",
    //     "results": false
    // },
    // {
    //     "id": "2024_INDONESIA_CHAMPIONSHIPS",
    //     "name": "Indonesia Championships",
    //     "eventType": "asiachampionship",
    //     "eventLogo": indonesiaChampionships,
    //     "date": "Jun 1, 2024",
    //     "flag": indonesia,
    //     "location": "Jakarta, Indonesia"
    // },
    // {
    //     "id": "2024_JAPAN_CHAMPIONSHIPS",
    //     "name": "Japan Championships",
    //     "eventType": "asiachampionship",
    //     "eventLogo": japanChampionships,
    //     "date": "Jun 1, 2024",
    //     "flag": japan,
    //     "location": "Yokohama, Japan",
    // },
    // {
    //     "id": "2024_LOS_ANGELES",
    //     "name": "Los Angeles Regionals",
    //     "eventType": "regionals",
    //     "eventLogo": regionals,
    //     "date": "May 25, 2024",
    //     "flag": usa,
    //     "location": "Los Angeles, California",
    // },
    // {
    //     "id": "2024_MEXICO_CITY",
    //     "name": "Mexico City Special Event",
    //     "eventType": "speSeries",
    //     "eventLogo": speSeries,
    //     "date": "May 25, 2024",
    //     "flag": mexico,
    //     "location": "Mexico City, Mexico",
    // },
    // {
    //     "id": "2024_LIMA",
    //     "name": "Lima Special Event",
    //     "eventType": "speSeries",
    //     "eventLogo": speSeries,
    //     "date": "May 25, 2024",
    //     "flag": peru,
    //     "location": "Lima, Peru",
    // },
    // {
    //     "id": "2024_JOHANNESBURG",
    //     "name": "Johannesburg Special Event",
    //     "eventType": "speSeries",
    //     "eventLogo": speSeries,
    //     "date": "May 25 , 2024",
    //     "flag": southAfrica,
    //     "location": "Johannesburg, South Africa",
    // },
    // {
    //     "id": "2024_PHILIPPINES_CHAMPIONSHIPS",
    //     "name": "Philippines Championships",
    //     "eventType": "asiachampionship",
    //     "eventLogo": philippenesChampionships,
    //     "date": "May 25, 2024",
    //     "flag": philippines,
    //     "location": "Taguig, Philippines",
    // },
    // {
    //     "id": "2024_SANTIAGO",
    //     "name": "Santiago Regionals",
    //     "eventType": "regionals",
    //     "eventLogo": regionals,
    //     "date": "May 18, 2024",
    //     "flag": chile,
    //     "location": "Santiago, Chile",
    // },
    // {
    //     "id": "2024_SINGAPORE_CHAMPIONSHIPS",
    //     "name": "Singapore Championships",
    //     "eventType": "asiachampionship",
    //     "eventLogo": singaporeChampionships,
    //     "date": "May 18, 2024",
    //     "flag": singapore,
    //     "location": "Singapore",
    // },
    // {
    //     "id": "2024_BOGOTA",
    //     "name": "Bogotá Special Event",
    //     "eventType": "speSeries",
    //     "eventLogo": speSeries,
    //     "date": "May 11, 2024",
    //     "flag": colombia,
    //     "location": "Bogotá, Colombia",
    // },
    // {
    //     "id": "2024_STOCKHOLM",
    //     "name": "Stockholm Regionals",
    //     "eventType": "regionals",
    //     "eventLogo": regionals,
    //     "date": "May 11, 2024",
    //     "flag": sweden,
    //     "location": "Stockholm, Sweden",
    // },
    // {
    //     "id": "2024_THAILAND_CHAMPIONSHIPS",
    //     "name": "Thailand Championships",
    //     "eventType": "asiaChampionship",
    //     "eventLogo": thailandChampionships,
    //     "date": "May 11, 2024",
    //     "flag": thailand,
    //     "location": "Thailand",
    // },
    // {
    //     "id": "2024_CAROLINA",
    //     "name": "Carolina Special Event",
    //     "eventType": "speSeries",
    //     "eventLogo": speSeries,
    //     "date": "May 11, 2024",
    //     "flag": puertoRico,
    //     "location": "Carolina, Puerto Rico",
    // },
    // {
    //     "id": "2024_KOREA_FINAL",
    //     "name": "Korean League Final Season",
    //     "eventType": "asiaChampionship",
    //     "eventLogo": koreaLeague,
    //     "date": "May 5, 2024",
    //     "flag": southKorea,
    //     "location": "South Korea",
    // },
    // {
    //     "id": "2024_BUENOS_AIRES",
    //     "name": "Buenos Aires Special Event",
    //     "eventType": "speSeries",
    //     "eventLogo": speSeries,
    //     "date": "May 4, 2024",
    //     "flag": argentina,
    //     "location": "Buenos Aires, Argentina",
    // },
    {
        "id": "2023_WORLDS",
        "name": "World Championships 2023",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 11, 2023",
        "flag": japan,
        "location": "Yokohama, Japan",
        "results": false
    },
    {
        "id": "2022_WORLDS",
        "name": "World Championships 2022",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 18, 2022",
        "flag": uk,
        "location": "London, United Kingdom"
    },
    {
        "id": "2019_WORLDS",
        "name": "World Championships 2019",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 16, 2019",
        "flag": usa,
        "location": "Washington DC, USA",
    },
    {
        "id": "2018_WORLDS",
        "name": "World Championships 2018",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 24, 2018",
        "flag": usa,
        "location": "Nashville, Tennessee",
    },
    {
        "id": "2017_WORLDS",
        "name": "World Championships 2017",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 18, 2017",
        "flag": usa,
        "location": "Anaheim, California"
    },
    {
        "id": "2017_NAIC",
        "name": "NAIC 2017",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Jun 30, 2017",
        "flag": usa,
        "location": "Indianapolis, Indiana",
    },
    {
        "id": "2017_LAIC",
        "name": "LAIC 2017",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Apr 21, 2017",
        "flag": brazil,
        "location": "São Paulo, Brazil",
    },
    {
        "id": "2017_EUIC",
        "name": "EUIC 2017",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Dec 9, 2016",
        "flag": uk,
        "location": "London, United Kingdom",
    },
    {
        "id": "2017_OCIC",
        "name": "OCIC 2017",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Mar 10, 2017",
        "flag": australia,
        "location": "Melbourne, Australia",
          },
    {
        "id": "2016_WORLDS",
        "name": "World Championships 2016",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 19, 2016",
        "flag": usa,
        "location": "San Fransisco, California",
    },
    {
        "id": "2015_WORLDS",
        "name": "World Championships 2015",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 21, 2015",
        "flag": usa,
        "location": "Boston, Massachusetts",
    },
    {
        "id": "2014_WORLDS",
        "name": "World Championships 2014",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 15, 2014",
        "flag": usa,
        "location": "Washington DC, USA",
    },
    {
        "id": "2013_WORLDS",
        "name": "World Championships 2013",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 9, 2013",
        "flag": canada,
        "location": "Vancouver, British Columbia",
    },
    {
        "id": "2012_WORLDS",
        "name": "World Championships 2012",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 13, 2012",
        "flag": usa,
        "location": "Waikōloa Village, Hawaii",
    },
    {
        "id": "2011_WORLDS",
        "name": "World Championships 2011",
        "eventType": "worlds",
        "eventLogo": worlds,
        "date": "Aug 12, 2011",
        "flag": usa,
        "location": "San Diego, California",
    },
    {
        "id": "2010_WORLDS",
        "name": "World Championships 2010",
        "eventType": "worlds",
        "eventLogo": worldsOten,
        "date": "Aug 13, 2010",
        "flag": usa,
        "location": "Waikōloa Village, Hawaii",
    },
    {
        "id": "2009_WORLDS",
        "name": "World Championships 2009",
        "eventType": "worlds",
        "eventLogo": worldsOnine,
        "date": "Aug 13, 2009",
        "flag": usa,
        "location": "San Diego, California",
    },
    {
        "id": "2008_WORLDS",
        "name": "World Championships 2008",
        "eventType": "worlds",
        "eventLogo": worldsOeight,
        "date": "Aug 15, 2008",
        "flag": usa,
        "location": "Orlando, Florida",
    },
    {
        "id": "2007_WORLDS",
        "name": "World Championships 2007",
        "eventType": "worlds",
        "eventLogo": worldsOSeven,
        "date": "Aug 10, 2007",
        "flag": usa,
        "location": "Waikōloa Village, Hawaii",
    },
    {
        "id": "2006_WORLDS",
        "name": "World Championships 2006",
        "eventType": "worlds",
        "eventLogo": worldsOsix,
        "date": "Aug 18, 2006",
        "flag": usa,
        "location": "Anaheim, California",
    },
    {
        "id": "2005_WORLDS",
        "name": "World Championships 2005",
        "eventType": "worlds",
        "eventLogo": worldsOfive,
        "date": "Aug 19, 2005",
        "flag": usa,
        "location": "San Diego, California",
    },
    {
        "id": "2004_WORLDS",
        "name": "World Championships 2004",
        "eventType": "worlds",
        "eventLogo": worldsOfour,
        "date": "Aug 2, 2004",
        "flag": usa,
        "location": "Orlando, Florida",
    },
    {
        "id": "2020_LAIC",
        "name": "LAIC 2020",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Nov 15, 2019",
        "flag": brazil,
        "location": "São Paulo, Brazil",
    },
    {
        "id": "2020_OCIC",
        "name": "OCIC 2020",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Feb 21, 2020",
        "flag": australia,
        "location": "Melbourne, Australia",
    },
    {
        "id": "2002_WORLDS/seniors",
        "name": "Worlds 2002",
        "eventType": "worlds",
        "eventLogo": wotcWorlds,
        "date": "Aug 2, 2002",
        "flag": usa,
        "location": "Seattle, Washington",
    },
    {
        "id": "2019_EUIC",
        "name": "EUIC 2019",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Apr 26, 2019",
        "flag": germany,
        "location": "Berlin, Germany",
    },
    {
        "id": "2019_LAIC",
        "name": "LAIC 2019",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Nov 16, 2018",
        "flag": brazil,
        "location": "São Paulo, Brazil",
    },
    {
        "id": "2019_OCIC",
        "name": "OCIC 2019",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Feb 15, 2019",
        "flag": australia,
        "location": "Melbourne, Australia",
    },
    {
        "id": "2019_NAIC",
        "name": "NAIC 2019",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Jun 21, 2019",
        "flag": usa,
        "location": "Columbus, Ohio",
    },
    {
        "id": "2018_EUIC",
        "name": "EUIC 2018",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Nov 17, 2017",
        "flag": uk,
        "location": "London, United Kingdom",
    },
    {
        "id": "2018_LAIC",
        "name": "LAIC 2018",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Apr 27, 2018",
        "flag": brazil,
        "location": "São Paulo, Brazil",
    },
    {
        "id": "2018_NAIC",
        "name": "NAIC 2018",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Jul 6, 2018",
        "flag": usa,
        "location": "Columbus, Ohio",
    },
    {
        "id": "2018_OCIC",
        "name": "OCIC 2018",
        "eventType": "internationals",
        "eventLogo": ogInternats,
        "date": "Feb 9, 2018",
        "flag": australia,
        "location": "Sydney, Australia",
    },
    {
        "id": "2014_NATS_US",
        "name": "US Nationals 2014",
        "eventType": "nationals",
        "eventLogo": nationals,
        "date": "Jul 4, 2014",
        "flag": usa,
        "location": "Indianapolis, Indiana",
    },
    {
        "id": "2013_NATS_US",
        "name": "US Nationals 2013",
        "eventType": "nationals",
        "eventLogo": nationals,
        "date": "Jul 5, 2013",
        "flag": usa,
        "location": "Indianapolis, Indiana",
    },
    {
        "id": "2012_NATS_US",
        "name": "US Nationals 2012",
        "eventType": "nationals",
        "eventLogo": nationals,
        "date": "Jun 30, 2012",
        "flag": usa,
        "location": "Indianapolis, Indiana",
    },
    {
        "id": "2011_NATS_US",
        "name": "US Nationals 2011",
        "eventType": "nationals",
        "eventLogo": nationals,
        "date": "Jul 8, 2011",
        "flag": usa,
        "location": "Indianapolis, Indiana",
    },
    {
        "id": "2010_NATS_US",
        "name": "US Nationals 2010",
        "eventType": "nationals",
        "eventLogo": oldNationals,
        "date": "Jun 25, 2010",
        "flag": usa,
        "location": "Indianapolis, Indiana",
    },
    {
        "id": "2009_NATS_US",
        "name": "US Nationals 2009",
        "eventType": "nationals",
        "eventLogo": oldNationals,
        "date": "Jun 27, 2009",
        "flag": usa,
        "location": "Indianapolis, Indiana",
    },
    {
        "id": "2008_NATS_US",
        "name": "US Nationals 2008",
        "eventType": "nationals",
        "eventLogo": oldNationals,
        "date": "Jun 28, 2008",
        "flag": usa,
        "location": "Columbus, Ohio",
    },
    {
        "id": "2007_NATS_US",
        "name": "US Nationals 2007",
        "eventType": "nationals",
        "eventLogo": oldNationals,
        "date": "Jul 7, 2007",
        "flag": usa,
        "location": "Columbus, Ohio",
    },
    {
        "id": "2006_NATS_US",
        "name": "US Nationals 2006",
        "eventType": "nationals",
        "eventLogo": oldNationals,
        "date": "Jul 1, 2006",
        "flag": usa,
        "location": "Columbus, Ohio",
    },
    {
        "id": "2005_NATS_US",
        "name": "US Nationals 2005",
        "eventType": "nationals",
        "eventLogo": oldNationals,
        "date": "Jul 2, 2005",
        "flag": usa,
        "location": "Columbus, Ohio",
    },
    {
        "id": "2004_NATS_US",
        "name": "US Nationals 2004",
        "eventType": "nationals",
        "eventLogo": oFourNationals,
        "date": "Jun 26, 2004",
        "flag": usa,
        "location": "Columbus, Ohio",
    },
    {
        "id": "2002_EU_SC",
        "name": "Europe Stadium Challenge",
        "eventType": "stadiumChallenge",
        "eventLogo": stadiumChallenge,
        "date": "Jun 2002",
        "flag": netherlands,
        "location": "Netherlands",
        "results": false
    },
    {
        "id": "2002_WCSC/seniors",
        "name": "West Coast Stadium Challenge",
        "eventType": "stadiumChallenge",
        "eventLogo": stadiumChallenge,
        "date": "Jun 8, 2002",
        "flag": usa,
        "location": "San Diego, California",
    },
    {
        "id": "2002_CSC",
        "name": "Central Stadium Challenge",
        "eventType": "stadiumChallenge",
        "eventLogo": stadiumChallenge,
        "date": "Apr 20, 2002",
        "flag": usa,
        "location": "Rosemont, Illinois",
    },
    {
        "id": "2002_ECSC/seniors",
        "name": "East Coast Stadium Challenge",
        "eventType": "stadiumChallenge",
        "eventLogo": stadiumChallenge,
        "date": "Mar 16, 2002",
        "flag": usa,
        "location": "Secaucus, New Jersey",
    },
    {
        "id": "2001_CA_STS_DAY2",
        "name": "California Super Trainer Showdown Day 2",
        "eventType": "superTrainerShowdown",
        "eventLogo": superTrainerShowdown,
        "date": "Dec 2, 2001",
        "flag": usa,
        "location": "San Diego, California",
    },
    {
        "id": "2001_CA_STS_DAY1",
        "name": "California Super Trainer Showdown Day 1",
        "eventType": "superTrainerShowdown",
        "eventLogo": superTrainerShowdown,
        "date": "Dec 1, 2001",
        "flag": usa,
        "location": "San Diego, California",
    },
    {
        "id": "2001_STS_QUALIFIER_SE",
        "name": "Sweden Super Trainer Showdown Qualifier",
        "eventType": "superTrainerShowdown",
        "eventLogo": superTrainerShowdown,
        "date": "Jun 30, 2001",
        "flag": sweden,
        "location": "Liseberg, Sweden"
    },
    {
        "id": "2001_NJ_STS",
        "name": "New Jersey Super Trainer Showdown Day 2",
        "eventType": "superTrainerShowdown",
        "eventLogo": superTrainerShowdown,
        "date": "Jun 24, 2001",
        "flag": usa,
        "location": "Secaucus, New Jersey",
    },
    {
        "id": "2001_NJ_STS_DAY1",
        "name": "New Jersey Super Trainer Showdown Day 1",
        "eventType": "superTrainerShowdown",
        "eventLogo": superTrainerShowdown,
        "date": "Jun 23, 2001",
        "flag": usa,
        "location": "Secaucus, New Jersey",
    },
    {
        "id": "2000_NJ_STS",
        "name": "New Jersey Super Trainer Showdown",
        "eventType": "superTrainerShowdown",
        "eventLogo": superTrainerShowdown,
        "date": "Nov 8, 2000",
        "flag": usa,
        "location": "Secaucus, New Jersey",
    },
    {
        "id": "2000_CA_STS",
        "name": "California Super Trainer Showdown",
        "eventType": "superTrainerShowdown",
        "eventLogo": superTrainerShowdown,
        "date": "Jul 22, 2000",
        "flag": usa,
        "location": "Long Beach, California",
    },
    // {
    //     "id": "eee",
    //     "name": "eee",
    //     "eventType": "eee",
    //     "eventLogo": eee,
    //     "date": "eee",
    //     "flag": eee,
    //     "location": "eee",
    // },
    // {
    //     "id": "eee",
    //     "name": "eee",
    //     "eventType": "eee",
    //     "eventLogo": eee,
    //     "date": "eee",
    //     "flag": eee,
    //     "location": "eee",
    // },
    // {
    //     "id": "eee",
    //     "name": "eee",
    //     "eventType": "eee",
    //     "eventLogo": eee,
    //     "date": "eee",
    //     "flag": eee,
    //     "location": "eee",
    // },
    // {
    //     "id": "eee",
    //     "name": "eee",
    //     "eventType": "eee",
    //     "eventLogo": eee,
    //     "date": "eee",
    //     "flag": eee,
    //     "location": "eee",
    // },
];

const parseDate = (dateStr) => {
    if (dateStr.startsWith('TBA')) {
        // Handle 'TBA' dates by setting them far in the future
        return new Date('9999-12-31');
    }
    return new Date(dateStr);
};

const sortedEvents = tournamentList.sort((a, b) => parseDate(a.date) - parseDate(b.date));

export { sortedEvents };