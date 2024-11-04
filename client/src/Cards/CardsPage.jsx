import React, { useEffect, useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useTheme } from '../contexts/ThemeContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../css/card.css';

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};

  .whole-set-view-area {
      background: ${({ theme }) => theme.setinfodark};
  }
`;

const SearchBarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

const SearchInput = styled.input`
  padding: 14px;
  width: 450px;
  border: 1px solid rgba(150,150,150,0.5);
  border-radius: 2px;
  margin: 0 10px;
  color: ${({ theme }) => theme.text};
  background-color: ${({ theme }) => theme.setChangeBtn};
`;

const DropdownButton = styled.button`
  padding: 10px 14px;
  width: 480px;
  border: 1px solid rgba(150,150,150,0.5);
  background-color: ${({ theme }) => theme.setChangeBtn};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  margin-bottom: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 2px;
`;

const DropdownOverlay = styled.div`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 10000;
`;

const DropdownContent = styled.div`
  display: ${({ show }) => (show ? 'block' : 'none')};
  position: absolute;
  background-color: ${({ theme }) => theme.body};
  width: 75%;
  box-shadow: 0px 8px 16px 0px rgb(0,0,0);
  z-index: 10001;
  overflow-y: auto;
  top: 0;
  border: 2px solid black;
`;

const DropdownTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th {
   padding: 8px;
  }
`;

const DropdownTableRow = styled.tr`
`;

const DropdownTableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid rgba(255,255,255,0.2);

  .settobechanged:hover {
    color: ${({ theme }) => theme.setChangeHover};
  }
`;

const SeparatorRow = styled.tr`
  background-color: #1291eba4 !important;
  color: white;
  font-weight: bold;

  td {
    padding: 8px !important;
  }
`;

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateString.replace(/-/g, '/'));
  return date.toLocaleDateString('en-US', options);
};

const CardsPage = () => {
  const { theme } = useTheme();
  const { setName } = useParams();
  const navigate = useNavigate(); 
  const [cards, setCards] = useState([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [nameText, setNameText] = useState(''); 
  const [setRelease, setSetRelease] = useState(''); 
  const [setTotal, setSetTotal] = useState(''); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const dropdownRef = useRef(null);
  const [hasSearched, setHasSearched] = useState(false);

  const availableSets = [
    { separator: true, text: "Scarlet & Violet"},
    { name: "Prismatic Evolutions", abbrev: "--", releaseDate: "Jan 17, 2025", total: "--", notavailable: true },
    { name: "Surging Sparks", abbrev: "SSP", releaseDate: "Nov 8, 2024", total: "--", notavailable: true },
    { name: "Stellar Crown", abbrev: "SCR", releaseDate: "Sep 13, 2024", total: "175"},
    { name: "Shrouded Fable", abbrev: "SFA", releaseDate: "Aug 2, 2024", total: "99" },
    { name: "Twilight Masquerade", abbrev: "TWM", releaseDate: "May 24, 2024", total: "226" },
    { name: "Temporal Forces", abbrev: "TEF", releaseDate: "Mar 22, 2024", total: "218" },
    { name: "Paldean Fates *", abbrev: "PAF", releaseDate: "Jan 26, 2024", total: "245" },
    { name: "Paradox Rift", abbrev: "PAR", releaseDate: "Nov 3, 2023", total: "266" },
    { name: "Pokémon 151 *", abbrev: "MEW", releaseDate: "Sep 22, 2023", total: "207" },
    { name: "Obsidian Flames", abbrev: "OBF", releaseDate: "Aug 11, 2023", total: "230" },
    { name: "Paldea Evolved", abbrev: "PAL", releaseDate: "Jun 9, 2023", total: "279" },
    { name: "Scarlet & Violet", abbrev: "SVI", releaseDate: "Mar 31, 2023", total: "252" },
    { name: "SV Energy", abbrev: "SVE", releaseDate: "Mar 31, 2023", total: "8" },
    { name: "SV Black Star Promos", abbrev: "PR-SV", releaseDate: "-", total: "75" },
    { separator: true, text: "Sword & Shield"},
    { name: "Crown Zenith *", abbrev: "CRZ", releaseDate: "Jan 20, 2023", total: "160" },
    { name: "Silver Tempest", abbrev: "SIT", releaseDate: "Nov 11, 2022", total: "215" },
    { name: "Lost Origin", abbrev: "LOR", releaseDate: "Sep 9, 2022", total: "217" },
    { name: "Pokémon GO *", abbrev: "PGO", releaseDate: "Jul 1, 2022", total: "88" },
    { name: "Astral Radiance", abbrev: "ASR", releaseDate: "May 27, 2022", total: "216" },
    { name: "Brilliant Stars", abbrev: "BRS", releaseDate: "Feb 25, 2022", total: "186" },
    { name: "Fusion Strike", abbrev: "FST", releaseDate: "Nov 12, 2021", total: "284" },
    { name: "Celebrations *", abbrev: "CEL", releaseDate: "Oct 8, 2021", total: "25" },
    { name: "Evolving Skies", abbrev: "EVS", releaseDate: "Aug 27, 2021", total: "237" },
    { name: "Chilling Reign", abbrev: "CRE", releaseDate: "Jun 18, 2021", total: "233" },
    { name: "Battle Styles", abbrev: "BST", releaseDate: "Mar 19, 2021", total: "183" },
    { name: "Shining Fates *", abbrev: "SHF", releaseDate: "Feb 19, 2021", total: "73" },
    { name: "Vivid Voltage", abbrev: "VIV", releaseDate: "Nov 13, 2020", total: "203" },
    { name: "Champion's Path *", abbrev: "CPA", releaseDate: "Sep 25, 2020", total: "80" },
    { name: "Darkness Ablaze", abbrev: "DAA", releaseDate: "Aug 14, 2020", total: "201" },
    { name: "Rebel Clash", abbrev: "RCL", releaseDate: "May 1, 2020", total: "209" },
    { name: "Sword & Shield", abbrev: "SSH", releaseDate: "Feb 7, 2020", total: "216" },
    { name: "SWSH Black Star Promos", abbrev: "PR-SW", releaseDate: "-", total: "181" },
    { separator: true, text: "Sun & Moon"},
    { name: "Cosmic Eclipse", abbrev: "CEC", releaseDate: "Nov 1, 2019", total: "272" },
    { name: "Hidden Fates *", abbrev: "HIF", releaseDate: "Aug 23, 2019", total: "69" },
    { name: "Unified Minds", abbrev: "UNM", releaseDate: "Aug 2, 2019", total: "260" },
    { name: "Unbroken Bonds", abbrev: "UNB", releaseDate: "May 3, 2019", total: "235" },
    { name: "Detective Pikachu *", abbrev: "DPI", releaseDate: "Apr 5, 2019", total: "18" },
    { name: "Team Up", abbrev: "TEU", releaseDate: "Feb 1, 2019", total: "198" },
    { name: "Lost Thunder", abbrev: "LOT", releaseDate: "Nov 2, 2018", total: "240" },
    { name: "Dragon Majesty *", abbrev: "DRM", releaseDate: "Sep 7, 2018", total: "80" },
    { name: "Celestial Storm", abbrev: "CES", releaseDate: "Aug 3, 2018", total: "187" },
    { name: "Forbidden Light", abbrev: "FLI", releaseDate: "May 4, 2018", total: "150" },
    { name: "Ultra Prism", abbrev: "UPR", releaseDate: "Feb 2, 2018", total: "178" },
    { name: "Crimson Invasion", abbrev: "CIN", releaseDate: "Nov 3, 2017", total: "126" },
    { name: "Shining Legends *", abbrev: "SLG", releaseDate: "Oct 6, 2017", total: "81" },
    { name: "Burning Shadows", abbrev: "BUS", releaseDate: "Aug 5, 2017", total: "177" },
    { name: "Guardians Rising", abbrev: "GRI", releaseDate: "May 5, 2017", total: "180" },
    { name: "Sun & Moon", abbrev: "SUM", releaseDate: "Feb 3, 2017", total: "173" },
    { name: "SM Black Star Promos", abbrev: "PR-SM", releaseDate: "-", total: "250" },
    { separator: true, text: "XY"},
    { name: "Evolutions", abbrev: "EVO", releaseDate: "Nov 2, 2016", total: "113" },
    { name: "Steam Siege", abbrev: "STS", releaseDate: "Aug 3, 2016", total: "116" },
    { name: "Fates Collide", abbrev: "FCO", releaseDate: "May 2, 2016", total: "129" },
    { name: "Generations *", abbrev: "GEN", releaseDate: "Feb 22, 2016", total: "117" },
    { name: "BREAKpoint", abbrev: "BKP", releaseDate: "Feb 3, 2016", total: "126" },
    { name: "BREAKthrough", abbrev: "BKT", releaseDate: "Nov 4, 2015", total: "165" },
    { name: "Ancient Origins", abbrev: "AOR", releaseDate: "Aug 12, 2015", total: "100" },
    { name: "Roaring Skies", abbrev: "ROS", releaseDate: "May 6, 2015", total: "112" },
    { name: "Double Crisis *", abbrev: "DCE", releaseDate: "Mar 25, 2015", total: "34" },
    { name: "Primal Clash", abbrev: "PRC", releaseDate: "Feb 4, 2015", total: "164" },
    { name: "Phantom Forces", abbrev: "PHF", releaseDate: "Nov 5, 2014", total: "124" },
    { name: "Furious Fists", abbrev: "FFI", releaseDate: "Aug 13, 2014", total: "114" },
    { name: "Flashfire", abbrev: "FLF", releaseDate: "May 7, 2014", total: "110" },
    { name: "XY", abbrev: "XY", releaseDate: "Feb 5, 2014", total: "146" },
    { name: "Kalos Starter Set *", abbrev: "KSS", releaseDate: "Nov 8, 2013", total: "39" },
    { name: "XY Black Star Promos", abbrev: "PR-XY", releaseDate: "-", total: "216" },
    { separator: true, text: "Black & White"},
    { name: "Legendary Treasures", abbrev: "LTR", releaseDate: "Nov 6, 2013", total: "140" },
    { name: "Plasma Blast", abbrev: "PLB", releaseDate: "Aug 14, 2013", total: "105" },
    { name: "Plasma Freeze", abbrev: "PLF", releaseDate: "May 8, 2013", total: "122" },
    { name: "Plasma Storm", abbrev: "PLS", releaseDate: "Feb 6, 2013", total: "138" },
    { name: "Boundaries Crossed", abbrev: "BCR", releaseDate: "Nov 7, 2012", total: "153" },
    { name: "Dragon Vault *", abbrev: "DRV", releaseDate: "Oct 5, 2012", total: "21" },
    { name: "Dragons Exalted", abbrev: "DRX", releaseDate: "Aug 15, 2012", total: "128" },
    { name: "Dark Explorers", abbrev: "DEX", releaseDate: "May 9, 2012", total: "111" },
    { name: "Next Destinies", abbrev: "NXD", releaseDate: "Feb 8, 2012", total: "103" },
    { name: "Noble Victories", abbrev: "NVI", releaseDate: "Nov 16, 2011", total: "102" },
    { name: "Emerging Powers", abbrev: "EPO", releaseDate: "Aug 31, 2011", total: "98" },
    { name: "Black & White", abbrev: "BLW", releaseDate: "Apr 25, 2011", total: "115" },
    { name: "BW Black Star Promos", abbrev: "PR-BLW", releaseDate: "-", total: "101" },
    { separator: true, text: "HeartGold & SoulSilver"},
    { name: "Call of Legends", abbrev: "CL", releaseDate: "Feb 9, 2011", total: "106" },
    { name: "Triumphant", abbrev: "TM", releaseDate: "Nov 3, 2010", total: "103" },
    { name: "Undaunted", abbrev: "UD", releaseDate: "Aug 18, 2010", total: "91" },
    { name: "Unleashed", abbrev: "UL", releaseDate: "May 12, 2010", total: "96" },
    { name: "HeartGold & SoulSilver", abbrev: "HS", releaseDate: "Feb 10, 2010", total: "124" },
    { name: "Pokémon Rumble *", abbrev: "RM", releaseDate: "Dec 2, 2009", total: "16" },
    { name: "HGSS Black Star Promos", abbrev: "PR-HS", releaseDate: "-", total: "25" },
    { separator: true, text: "Diamond & Pearl"},
    { name: "Arceus", abbrev: "AR", releaseDate: "Nov 4, 2009", total: "111" },
    { name: "Supreme Victors", abbrev: "SV", releaseDate: "Aug 19, 2009", total: "153" },
    { name: "Rising Rivals", abbrev: "RR", releaseDate: "May 16, 2009", total: "120" },
    { name: "POP Series 9 *", abbrev: "P9", releaseDate: "Mar 1, 2009", total: "17" },
    { name: "Platinum", abbrev: "PL", releaseDate: "Feb 11, 2009", total: "133" },
    { name: "Stormfront", abbrev: "SF", releaseDate: "Nov 1, 2008", total: "106" },
    { name: "POP Series 8 *", abbrev: "P8", releaseDate: "Sep 1, 2008", total: "17" },
    { name: "Legends Awakened", abbrev: "LA", releaseDate: "Aug 1, 2008", total: "146" },
    { name: "Majestic Dawn", abbrev: "MD", releaseDate: "May 1, 2008", total: "100" },
    { name: "POP Series 7 *", abbrev: "P7", releaseDate: "Mar 1, 2008", total: "17" },
    { name: "Great Encounters", abbrev: "GE", releaseDate: "Feb 1, 2008", total: "106" },
    { name: "Secret Wonders", abbrev: "SW", releaseDate: "Nov 1, 2007", total: "132" },
    { name: "POP Series 6 *", abbrev: "P6", releaseDate: "Sep 1, 2007", total: "17" },
    { name: "Mysterious Treasures", abbrev: "MT", releaseDate: "Aug 1, 2007", total: "124" },
    { name: "Diamond & Pearl", abbrev: "DP", releaseDate: "May 1, 2007", total: "130" },
    { name: "DP Black Star Promos", abbrev: "PR-DP", releaseDate: "-", total: "56" },
    { separator: true, text: "Ruby & Sapphire"},
    { name: "POP Series 5 *", abbrev: "P5", releaseDate: "Mar 1, 2007", total: "17" },
    { name: "Power Keepers", abbrev: "PK", releaseDate: "Feb 2, 2007", total: "108" },
    { name: "Dragon Frontiers", abbrev: "DF", releaseDate: "Nov 1, 2006", total: "101" },
    { name: "POP Series 4 *", abbrev: "P4", releaseDate: "Aug 1, 2006", total: "17" },
    { name: "Crystal Guardians", abbrev: "CG", releaseDate: "Aug 1, 2006", total: "100" },
    { name: "Holon Phantoms", abbrev: "HP", releaseDate: "May 1, 2006", total: "111" },
    { name: "POP Series 3 *", abbrev: "P3", releaseDate: "Apr 1, 2006", total: "17" },
    { name: "EX Trainer Kit 2 *", abbrev: "TK2", releaseDate: "Mar 1, 2006", total: "12" },
    { name: "Legend Maker", abbrev: "LM", releaseDate: "Feb 1, 2006", total: "93" },
    { name: "Delta Species", abbrev: "DS", releaseDate: "Oct 31, 2005", total: "114" },
    { name: "POP Series 2 *", abbrev: "P2", releaseDate: "Aug 1, 2005", total: "17" },
    { name: "Unseen Forces", abbrev: "UF", releaseDate: "Aug 1, 2005", total: "145" },
    { name: "Emerald", abbrev: "EM", releaseDate: "May 1, 2005", total: "107" },
    { name: "Deoxys", abbrev: "DX", releaseDate: "Feb 1, 2005", total: "108" },
    { name: "Team Rocket Returns", abbrev: "TRR", releaseDate: "Nov 1, 2004", total: "111" },
    { name: "POP Series 1 *", abbrev: "P1", releaseDate: "Sep 1, 2004", total: "17" },
    { name: "FireRed & LeafGreen", abbrev: "FL", releaseDate: "Sep 1, 2004", total: "116" },
    { name: "EX Trainer Kit *", abbrev: "TK1", releaseDate: "Jun 1, 2004", total: "10" },
    { name: "Hidden Legends", abbrev: "HL", releaseDate: "Jun 1, 2004", total: "102" },
    { name: "Team Magma vs Team Aqua", abbrev: "MA", releaseDate: "Mar 1, 2004", total: "97" },
    { name: "Dragon", abbrev: "DR", releaseDate: "Nov 24, 2003", total: "100" },
    { name: "Sandstorm", abbrev: "SS", releaseDate: "Sep 18, 2003", total: "100" },
    { name: "Ruby & Sapphire", abbrev: "RS", releaseDate: "Jul 1, 2003", total: "109" },
    { name: "Nintendo Black Star Promos", abbrev: "PR-EX", releaseDate: "-", total: "40" },
    { separator: true, text: "WotC"},
    { name: "Skyridge", abbrev: "SK", releaseDate: "May 12, 2003", total: "182" },
    { name: "Aquapolis", abbrev: "AQ", releaseDate: "Jan 15, 2003", total: "182" },
    { name: "Expedition", abbrev: "EX", releaseDate: "Sep 15, 2002", total: "165" },
    { name: "Legendary Collection", abbrev: "LC", releaseDate: "May 24, 2002", total: "110" },
    { name: "Neo Destiny", abbrev: "N4", releaseDate: "Feb 28, 2002", total: "113" },
    { name: "Neo Revelation", abbrev: "N3", releaseDate: "Sep 21, 2001", total: "66" },
    { name: "Southern Islands *", abbrev: "SI", releaseDate: "Jul 31, 2001", total: "18" },
    { name: "Neo Discovery", abbrev: "N2", releaseDate: "Jun 1, 2001", total: "75" },
    { name: "Neo Genesis", abbrev: "N1", releaseDate: "Dec 16, 2000", total: "111" },
    { name: "Gym Challenge", abbrev: "G2", releaseDate: "Oct 16, 2000", total: "132" },
    { name: "Gym Heroes", abbrev: "G1", releaseDate: "Aug 14, 2000", total: "132" },
    { name: "Team Rocket", abbrev: "TR", releaseDate: "Apr 24, 2000", total: "83" },
    { name: "Base Set 2", abbrev: "B2", releaseDate: "Feb 24, 2000", total: "130" },
    { name: "Fossil", abbrev: "FO", releaseDate: "Oct 10, 1999", total: "62" },
    { name: "Jungle", abbrev: "JU", releaseDate: "Jun 16, 1999", total: "64" },
    { name: "Base Set", abbrev: "BS", releaseDate: "Jan 9, 1999", total: "102" },
    { name: "Wizards Black Star Promos", abbrev: "PR-BS", releaseDate: "-", total: "53" }
  ];

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`https://ptcg-legends-6abc11783376.herokuapp.com/api/cards/${setName}`);
        if (response.ok) {
          const data = await response.json();
  
          if (setName !== "BOB") {
            data.sort((a, b) => {
              const isSpecial = (number) => /^(RC|SH|GG|TG|CC|SV|SL|ONE|TWO|THREE|FOUR|grass|fire|water|lightning|fighting|psychic|dark|metal|fairy)/.test(number);
              const extractNumber = (number) => {
                const match = number.match(/(\d+)(a?)/i);
                return match ? [parseInt(match[1], 10), match[2] || ''] : [NaN, ''];
              };
  
              const [aNum, aSuffix] = extractNumber(a.number);
              const [bNum, bSuffix] = extractNumber(b.number);
              const aIsSpecial = isSpecial(a.number);
              const bIsSpecial = isSpecial(b.number);
  
              if (aIsSpecial && !bIsSpecial) return 1;
              if (!aIsSpecial && bIsSpecial) return -1;
              if (aIsSpecial && bIsSpecial) {
                return aNum - bNum;
              }
  
              if (aNum === bNum) {
                return aSuffix.localeCompare(bSuffix);
              }
  
              return aNum - bNum;
            });
          }
  
          setCards(data);
  
          if (data.length > 0) {
            setLogoUrl(data[0].set.images.logo);
            setNameText(data[0].set.name);
            setSetRelease(formatDate(data[0].set.releaseDate));
            setSetTotal(data[0].set.total);
          }
        } else {
          console.error('Failed to fetch cards');
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };
  
    fetchCards();
  }, [setName]);

const handleSearch = async () => {
    try {
        let query = searchQuery.trim().toLowerCase(); // Convert the query to lowercase
        
        // Check if the query is exactly "n" (case-insensitive)
        let url;
        if (query === "n") {
            // Use the exact match API endpoint
            url = `https://ptcg-legends-6abc11783376.herokuapp.com/api/cards/searchbyname/${encodeURIComponent(query.toUpperCase())}`;
        } else {
            // Use the partial match API endpoint
            url = `https://ptcg-legends-6abc11783376.herokuapp.com/api/cards/searchbyname/partial/${encodeURIComponent(query)}`;
        }

        const response = await fetch(url);
        
        if (response.ok) {
            const searchData = await response.json();

            // Sort cards by release date (newest first)
            const sortedData = searchData.sort((a, b) => new Date(b.set.releaseDate) - new Date(a.set.releaseDate));

            setFilteredCards(sortedData);
            setHasSearched(true); // Set hasSearched to true when a search is performed
            console.log(sortedData); // Log the sorted results for debugging
        } else {
            console.error('Failed to fetch search results');
        }
    } catch (error) {
        console.error('Error fetching search results:', error);
    }
};


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const observer = useRef();

  const lastCardElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisibleIndexes(prevVisibleIndexes => {
          const newVisibleIndexes = new Set(prevVisibleIndexes);
          for (let i = 0; i < cards.length; i++) {
            newVisibleIndexes.add(i);
          }
          return newVisibleIndexes;
        });
      }
    });
    if (node) observer.current.observe(node);
  }, [cards]);

  const handleSetChange = (abbrev) => {
    navigate(`/cards/${abbrev}`);
    setDropdownOpen(false);
    setHasSearched(false); // Reset the search state
    setSearchQuery(''); // Clear the search query
    setFilteredCards([]); // Clear the filtered cards
  };

  const handleClickOutside = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, handleClickOutside]);

  return (
    <CardsContainer theme={theme}>
      <Helmet>
        <title>All Cards</title>
        <meta name="description" content={`Browse all cards from the ${setName} collection.`} />
        <meta property="og:title" content={`PTCG Legends - ${setName} Cards`} />
        <meta property="og:description" content={`Browse all cards from the ${setName} collection.`} />
      </Helmet>
      <div className='card-set-container'>
        <div className='align-column'>
          <SearchBarContainer className='seartcjbarcontainer'>
            <SearchInput
              className='serchbtrn'
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress} // Listen for Enter key
              placeholder="Search any card name..."
            />
          </SearchBarContainer>
          <DropdownButton className='dropdownbutton' onClick={() => setDropdownOpen(!dropdownOpen)}>
            <p>Change Set</p>
            <span className="material-symbols-outlined">keyboard_arrow_down</span>
          </DropdownButton>
        </div>
        <DropdownOverlay show={dropdownOpen} />
        <DropdownContent className='dropdowncontent' ref={dropdownRef} show={dropdownOpen} theme={theme}>
          <p className='small-disclaimer-text'>~ Special sets marked with symbol *</p>
          <DropdownTable className='setpopuptr'>
            <thead>
              <tr>
                <th>Set Name</th>
                <th>Abbreviation</th>
                <th className='hidetdonsmall'>Cards</th>
                <th>Release</th>
              </tr>
            </thead>
            <tbody>
              {availableSets.map((set, index) => (
                set.separator ? (
                  <SeparatorRow key={index}>
                    <td colSpan="4">{set.text}</td>
                  </SeparatorRow>
                ) : (
                  <DropdownTableRow
                    key={index}
                    onClick={() => !set.notavailable && handleSetChange(set.abbrev)}
                    theme={theme}
                    style={{
                      opacity: set.notavailable ? 0.5 : 1,
                      pointerEvents: set.notavailable ? 'none' : 'auto',
                    }}
                  >
                    <DropdownTableCell>
                      <Link className='settobechanged' to={`/cards/${set.abbrev}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {set.name}
                      </Link>
                    </DropdownTableCell>
                    <DropdownTableCell className='setabbrevopacque'>{set.abbrev}</DropdownTableCell>
                    <DropdownTableCell className='hidetdonsmall'>{set.total}</DropdownTableCell>
                    <DropdownTableCell>{set.releaseDate}</DropdownTableCell>
                  </DropdownTableRow>
                )
              ))}
            </tbody>
          </DropdownTable>
        </DropdownContent>
        <div className='whole-set-view-area'>
          {!hasSearched && (
            <div className='set-info-area'>
              {logoUrl && <img src={logoUrl} alt="Set Logo" />}
              <div className='setinfotext'>
                {nameText && <p>{nameText}</p>}
                {setRelease && !nameText.toLowerCase().includes('promo') && <p>{setRelease}</p>}
                {setTotal && <p>Cards: {setTotal}</p>}
              </div>
            </div>
          )}
          <div className='card-display-area'>
            {(filteredCards.length > 0 ? filteredCards : cards).map((card, index) => (
              <Link key={index} to={`/card/${card.setAbbrev}/${card.number}`}>
                <img
                  src={card.images.small}
                  loading="lazy"
                  alt={`${card.setAbbrev} ${card.number}`}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CardsContainer>
  );
};

export default CardsPage;
