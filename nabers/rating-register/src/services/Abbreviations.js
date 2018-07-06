// http://jaspreetchahal.org/australian-street-types-and-abbreviations-database/
let abbreviationMap = {
  'AL': 'ALLEY',
  'AMB': 'AMBLE',
  'APPR': 'APPROACH',
  'ARC': 'ARCADE',
  'ART': 'ARTERIAL',
  'AV': 'AVENUE',
  'AVE': 'AVENUE',
  'BAY': 'BAY',
  'BRK': 'BREAK',
  'BVD': 'BOULEVARD',
  'BLVD': 'BOULEVARD',
  'BWK': 'BOARDWALK',
  'BWL': 'BOWL',
  'BYP': 'BYPASS',
  'CCL': 'CIRCLE',
  'CCS': 'CIRCUS',
  'CCT': 'CIRCUIT',
  'CHA': 'CHASE',
  'CL': 'CLOSE',
  'CNR': 'CORNER',
  'COM': 'COMMON',
  'CON': 'CONCOURSE',
  'CR': 'CRESCENT',
  'CROS': 'CROSS',
  'CRSE': 'COURSE',
  'CRST': 'CREST',
  'CRY': 'CRUISEWAY',
  'CT': 'COURT',
  'CV': 'COVE',
  'DIV': 'DIVIDE',
  'DOM': 'DOMAIN',
  'DR': 'DRIVE',
  'EDG': 'EDGE',
  'ENT': 'ENTRANCE',
  'ESP': 'ESPLANADE',
  'EXTN': 'EXTENSION',
  'FLTS': 'FLATS',
  'FWY': 'FREEWAY',
  'GDN': 'GARDEN',
  'GLA': 'GLADE',
  'GLN': 'GLEN',
  'GLY': 'GULLY',
  'GRA': 'GRANGE',
  'GRN': 'GREEN',
  'GV': 'GROVE',
  'GWY': 'GATEWAY',
  'HLW': 'HOLLOW',
  'HTH': 'HEATH',
  'HTS': 'HEIGHTS',
  'HUB': 'HUB',
  'HWY': 'HIGHWAY',
  'ID': 'ISLAND',
  'JCT': 'JUNCTION',
  'LA': 'LANE',
  'LNK': 'LINK',
  'LWR': 'LOWER',
  'LWY': 'LANEWAY',
  'MWS': 'MEWS',
  'NTH': 'NORTH',
  'OUT': 'OUTLOOK',
  'PATH': 'PATH',
  'PDE': 'PARADE',
  'PKT': 'POCKET',
  'PKW': 'PARKWAY',
  'PL': 'PLACE',
  'PLZ': 'PLAZA',
  'PRM': 'PROMENADE',
  'PS': 'PASS',
  'PSG': 'PASSAGE',
  'PT': 'POINT',
  'PUR': 'PURSUIT',
  'PWAY': 'PATHWAY',
  'QD': 'QUADRANT',
  'QU': 'QUAY',
  'RCH': 'REACH',
  'RD': 'ROAD',
  'RDG': 'RIDGE',
  'REST': 'REST',
  'RET': 'RETREAT',
  'RND': 'ROUND',
  'ROW': 'ROW',
  'RSG': 'RISING',
  'RTN': 'RETURN',
  'SLO': 'SLOPE',
  'SQ': 'SQUARE',
  'ST': 'STREET',
  'STH': 'SOUTH',
  'STP': 'STRIP',
  'STPS': 'STEPS',
  'SUB': 'SUBWAY',
  'TCE': 'TERRACE',
  'THRU': 'THROUGHWAY',
  'TOR': 'TOR',
  'TRK': 'TRACK',
  'TRL': 'TRAIL',
  'TWY': 'TOLLWAY',
  'UPR': 'UPPER',
  'VLY': 'VALLEY',
  'VST': 'VISTA',
  'VW': 'VIEW',
  'WAY': 'WAY',
  'WD': 'WOOD',
  'WK': 'WALK',
  'WKWY': 'WALKWAY',
  'WTRS': 'WATERS',
  'WRY': 'WATERWAY',
  'WYD': 'WYND',
  'NSW': 'NEW SOUTH WALES',
  'QLD': 'QUEENSLAND',
  'SA': 'SOUTH AUSTRALIA',
  'TAS': 'TASMANIA',
  'VIC': 'VICTORIA',
  'WA': 'WESTERN AUSTRALIA',
  'ACT': 'AUSTRALIAN CAPITAL TERRIOTORY',
  'JBT': 'JERVIS BAY TERRITORY',
  'NT': 'NORTHERN TERRITORY'
}

export default class Abbreviations {
  getFullFromAbbreviation (full) {
    let abbr = abbreviationMap[full.toUpperCase()]
    return abbr === undefined ? null : abbr
  }
}
