// src/utils/legality.js
// keep these exactly as you have them now so CardView behavior doesn't change
export const bannedInExpanded = [
  { name: 'Archeops', set: 'DEX', number: '110' },
  { name: 'Archeops', set: 'NVI', number: '67' },
  { name: 'Chip-Chip Ice Axe', set: 'UNB', number: '165' },
  { name: 'Delinquent', set: 'BKP', number: '98' },
  { name: 'Delinquent', set: 'BKP', number: '98a' },
  { name: 'Delinquent', set: 'BKP', number: '98b' },
  { name: 'Duskull', set: 'CEC', number: '83' },
  { name: 'Flabébé', set: 'FLI', number: '83' },
  { name: 'Forest of Giant Plants', set: 'AOR', number: '74' },
  { name: 'Ghetsis', set: 'PLF', number: '101' },
  { name: 'Ghetsis', set: 'PLF', number: '115' },
  { name: 'Hex Maniac', set: 'AOR', number: '75' },
  { name: 'Hex Maniac', set: 'AOR', number: '75a' },
  { name: 'Island Challenge Amulet', set: 'CEC', number: '194' },
  { name: 'Island Challenge Amulet', set: 'CEC', number: '265' },
  { name: 'Jessie & James', set: 'HIF', number: '58' },
  { name: 'Jessie & James', set: 'HIF', number: '68' },
  { name: "Lt. Surge's Strategy", set: 'UNB', number: '178' },
  { name: "Lt. Surge's Strategy", set: 'HIF', number: '60' },
  { name: "Lysandre's Trump Card", set: 'PHF', number: '99' },
  { name: "Lysandre's Trump Card", set: 'PHF', number: '118' },
  { name: 'Marshadow', set: 'SLG', number: '45' },
  { name: 'Marshadow', set: 'PR-SM', number: '85' },
  { name: "Maxie's Hidden Ball Trick", set: 'PRC', number: '133' },
  { name: "Maxie's Hidden Ball Trick", set: 'PRC', number: '158' },
  { name: 'Milotic', set: 'FLF', number: '23' },
  { name: 'Mismagius', set: 'UNB', number: '78' },
  { name: 'Oranguru', set: 'UPR', number: '114' },
  { name: 'Puzzle of Time', set: 'BKP', number: '109' },
  { name: 'Red Card', set: 'GEN', number: '71' },
  { name: 'Reset Stamp', set: 'UNM', number: '206' },
  { name: 'Reset Stamp', set: 'UNM', number: '206a' },
  { name: 'Reset Stamp', set: 'UNM', number: '253' },
  { name: 'Sableye', set: 'DEX', number: '62' },
  { name: 'Scoop Up Net', set: 'RCL', number: '165' },
  { name: 'Scoop Up Net', set: 'RCL', number: '207' },
  { name: 'Shaymin-EX', set: 'ROS', number: '77' },
  { name: 'Shaymin-EX', set: 'ROS', number: '77a' },
  { name: 'Shaymin-EX', set: 'ROS', number: '106' },
  { name: 'Unown', set: 'LOT', number: '90' },
  { name: 'Unown', set: 'LOT', number: '91' },
];

export const bannedInGLC = [
  { name: 'Chip-Chip Ice Axe', set: 'UNB', number: '165' },
  { name: 'Forest of Giant Plants', set: 'AOR', number: '74' },
  { name: 'Hiker', set: 'CES', number: '133' },
  { name: 'Hiker', set: 'HIF', number: 'SV85' },
  { name: 'Kyogre', set: 'SHF', number: '21' },
  { name: "Lysandre's Trump Card", set: 'PHF', number: '99' },
  { name: "Lysandre's Trump Card", set: 'PHF', number: '118' },
  { name: 'Oranguru', set: 'UPR', number: '114' },
  { name: 'Pokémon Research Lab', set: 'UNM', number: '205' },
  { name: 'Raikou', set: 'VIV', number: '50' },
  { name: 'Marshadow', set: 'SLG', number: '45' },
  { name: 'Marshadow', set: 'PR-SM', number: '85' },
  { name: 'Duskull', set: 'CEC', number: '83' },
  { name: 'Double Colorless Energy', set: 'SLG', number: '69' },
  { name: 'Double Colorless Energy', set: 'SUM', number: '136' },
  { name: 'Double Colorless Energy', set: 'GRI', number: '166' },
  { name: 'Double Colorless Energy', set: 'EVO', number: '90' },
  { name: 'Double Colorless Energy', set: 'FCO', number: '114' },
  { name: 'Double Colorless Energy', set: 'PHF', number: '111' },
  { name: 'Double Colorless Energy', set: 'XY', number: '130' },
  { name: 'Double Colorless Energy', set: 'LTR', number: '113' },
  { name: 'Double Colorless Energy', set: 'NXD', number: '92' },
  { name: 'Double Colorless Energy', set: 'HGS', number: '103' },
  { name: 'Double Colorless Energy', set: 'BS2', number: '124' },
  { name: 'Double Colorless Energy', set: 'BS', number: '96' },
  { name: 'Twin Energy', set: 'RCL', number: '174' },
  { name: 'Twin Energy', set: 'RCL', number: '209' },
];

const ccNumber = (card) => {
  const raw = (card?.number || '').toString().trim().toUpperCase(); // e.g. "CC16"
  if (!raw.startsWith('CC')) return null;
  const n = parseInt(raw.slice(2).replace(/^0+/, '') || '0', 10);
  return Number.isFinite(n) ? n : null;
};

const isCelClassicCollection = (card) => {
  const abbrev  = (card?.setAbbrev || '').toUpperCase(); // "CEL"
  const setId   = (card?.set?.id || '').toLowerCase();   // "cel25c"
  const setName = (card?.set?.name || '');               // "Celebrations: Classic Collection"
  return (
    abbrev === 'CEL' ||
    setId === 'cel25c' ||
    /Celebrations:\s*Classic Collection/i.test(setName)
  );
};

const expandedSets = ['black & white', 'xy', 'sun & moon', 'sword & shield', 'scarlet & violet'];
const excludedGLCSubtypes = new Set(
  ["EX","GX","ex","V","VMAX","VSTAR","Prism Star","Radiant","ACE SPEC","V-UNION"].map(s=>s.toLowerCase())
);

// ---- helpers exported ----
export const isBannedInExpanded = (card) =>
  bannedInExpanded.some(b =>
    b.name.toLowerCase() === card.name.toLowerCase() &&
    b.set.toLowerCase()  === card.setAbbrev.toLowerCase() &&
    b.number            === card.number
  );

export const isBannedInGLC = (card) => {
  if (card.name.trim().toLowerCase() === 'double colorless energy') return true;
  return bannedInGLC.some(b =>
    b.name.toLowerCase() === card.name.toLowerCase() &&
    b.set.toLowerCase()  === card.setAbbrev.toLowerCase() &&
    b.number            === card.number
  );
};

export function isGLCLegal(card) {
  if (isCelClassicCollection(card)) {
    const n = ccNumber(card);
    if (n && n >= 1 && n <= 19) return false;
  }
  // subtype exclusions
  if (card.subtypes?.some(s => excludedGLCSubtypes.has(String(s).toLowerCase()))) return false;
  if (isBannedInGLC(card)) return false;

  // DCE by name
  if (card.name.trim().toLowerCase() === 'double colorless energy') return false;

  // Series check (Pokémon + Trainers + Energy)
  const series = card.set?.series?.toLowerCase();
  return !!series && expandedSets.includes(series);
}

// NOTE: pass in a cardMap (like your cardData.cardMap) *if* you want reprint logic for Trainers/Energies.
export function isStandardLegal(card, { regulationMarks = ['G','H','I','J','K','L','M'], cardMap } = {}) {
  if (card.regulationMark && regulationMarks.includes(card.regulationMark)) return true;

  // Reprint rule for Trainers/Energies: any reprint with a legal reg mark counts
  if (card.supertype !== 'Pokémon' && cardMap) {
    const others = Object.values(cardMap).filter(c => c.name.toLowerCase() === card.name.toLowerCase());
    return others.some(c => c.regulationMark && regulationMarks.includes(c.regulationMark));
  }

  return false;
}

// If you have pre-fetched other versions, pass them in via {otherVersions} to enable the reprint rule.
// Otherwise this falls back to series + banlist.
export function isExpandedLegal(card, { otherVersions = [], standardCheck = isStandardLegal } = {}) {
  // CEL CC* ban
  if (card.setAbbrev === 'CEL' && /^CC(1[0-9]|[1-9])$/.test(card.number)) return false;

  if (card.supertype !== 'Pokémon' && otherVersions.length) {
    const hasStdReprint = otherVersions
      .filter(o => o.name.toLowerCase() === card.name.toLowerCase())
      .some(o => standardCheck(o));
    if (hasStdReprint) return true;
  }

  const series = card.set?.series?.toLowerCase();
  if (!series || !expandedSets.includes(series)) return false;
  if (isBannedInExpanded(card)) return false;

  return true;
}
