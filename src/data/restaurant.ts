export interface OpeningDay {
  dayIndex: number; // 0 = Sun, 1 = Mon, ... 6 = Sat
  label: string;
  short: string;
  schemaDay: string;
  closed: boolean;
  slots: Array<{ open: string; close: string }>;
}

export interface ReviewItem {
  author: string;
  rating: number;
  context: string;
  quote: string;
}

export const RESTAURANT = {
  name: 'Ristorante Verdi Pizzeria',
  shortName: 'Ristorante Verdi',
  tagline: 'Kompositionen aus Küche & Keller',
  subtitle: 'Steinofen-Pizza, frische Pasta & italienische Klassiker in Hessisch Lichtenau',
  street: 'Desseler Straße 15',
  landmark: 'gegenüber der Grundschule',
  postalCode: '37235',
  city: 'Hessisch Lichtenau',
  country: 'DE',
  fullAddress: 'Desseler Straße 15, 37235 Hessisch Lichtenau',
  plusCode: '5PWF+JG Hessisch Lichtenau',
  geo: {
    lat: 51.1965095,
    lng: 9.7238208,
  },
  phoneDisplay: '05602 7100',
  phoneHref: 'tel:+4956027100',
  phoneInternational: '+49 5602 7100',
  googleMapsUrl: 'https://maps.app.goo.gl/6uSS1vph49arW5SGA',
  googleMapsEmbedUrl:
    'https://www.google.com/maps?q=Restaurante+Verdi,+Desseler+Str.+15,+37235+Hessisch+Lichtenau&hl=de&z=16&output=embed',
  facebookUrl: 'https://www.facebook.com/rist.verdi',
  rating: {
    score: 4.7,
    scoreDisplay: '4,7',
    count: 216,
    fiveStarCount: 173,
  },
  priceRange: '€',
  pricePerPerson: '10–20 € pro Person',
  peakHint: 'Freitagabend (18–20 Uhr) ist traditionell am meisten los – am besten kurz vorab telefonisch bestellen.',
} as const;

export const OPENING_HOURS: OpeningDay[] = [
  {
    dayIndex: 1,
    label: 'Montag',
    short: 'Mo',
    schemaDay: 'Monday',
    closed: false,
    slots: [
      { open: '11:00', close: '14:30' },
      { open: '17:00', close: '21:30' },
    ],
  },
  {
    dayIndex: 2,
    label: 'Dienstag',
    short: 'Di',
    schemaDay: 'Tuesday',
    closed: true,
    slots: [],
  },
  {
    dayIndex: 3,
    label: 'Mittwoch',
    short: 'Mi',
    schemaDay: 'Wednesday',
    closed: false,
    slots: [
      { open: '11:00', close: '14:30' },
      { open: '17:00', close: '21:30' },
    ],
  },
  {
    dayIndex: 4,
    label: 'Donnerstag',
    short: 'Do',
    schemaDay: 'Thursday',
    closed: false,
    slots: [
      { open: '11:00', close: '14:30' },
      { open: '17:00', close: '21:30' },
    ],
  },
  {
    dayIndex: 5,
    label: 'Freitag',
    short: 'Fr',
    schemaDay: 'Friday',
    closed: false,
    slots: [
      { open: '11:00', close: '14:30' },
      { open: '17:00', close: '21:30' },
    ],
  },
  {
    dayIndex: 6,
    label: 'Samstag',
    short: 'Sa',
    schemaDay: 'Saturday',
    closed: false,
    slots: [
      { open: '11:00', close: '14:30' },
      { open: '17:00', close: '21:30' },
    ],
  },
  {
    dayIndex: 0,
    label: 'Sonntag',
    short: 'So',
    schemaDay: 'Sunday',
    closed: false,
    slots: [
      { open: '11:00', close: '14:30' },
      { open: '17:00', close: '21:30' },
    ],
  },
];

// Ausschließlich verifizierte Google-Bewertungen aus der Recherche
export const REVIEWS: ReviewItem[] = [
  {
    author: 'D Erden',
    rating: 5,
    context: 'Vor Ort · Google-Bewertung',
    quote:
      'Das ist mit Abstand der beste Italiener weit und breit. Keiner kann dem Herren das Wasser reichen – jeder Besuch eine absolute zehn von zehn, Preis-Leistungs-Verhältnis absolut top!',
  },
  {
    author: 'Joh. K.',
    rating: 5,
    context: 'Google-Bewertung',
    quote:
      'Preis-Leistung ist super! Die Pizzen sind ein Genuss! Der Service ist unglaublich schnell. Immer gerne wieder!',
  },
  {
    author: 'Svenja Schmidt',
    rating: 5,
    context: 'Vor Ort · Google-Bewertung',
    quote:
      'Die Pizza war schnell fertig und hat sehr lecker geschmeckt. In dem Laden ist Selbstbedienung, ist aber nicht schlimm. Man kann drin gemütlich sitzen.',
  },
  {
    author: 'Sandra',
    rating: 5,
    context: 'Google-Bewertung',
    quote:
      'Das Essen war gut, Pizzateig schön dünn und lecker belegt, der Salat sehr reichhaltig mit Ei, Thunfisch und Käse – auch eine schöne Portion Eiweiß.',
  },
  {
    author: 'Swester',
    rating: 5,
    context: 'Zum Mitnehmen · Google-Bewertung',
    quote:
      'Bestellen klappt einfach wunderbar! Wirklich gute Preise, ordentlich große Portionen und es schmeckt super lecker. Ab jetzt bestellen wir nur noch hier!',
  },
  {
    author: 'Gerrit EsPunkt',
    rating: 5,
    context: 'Google-Bewertung',
    quote:
      'Super lecker, preislich unschlagbar. Kein richtiges Restaurant, nur Selbstbedienung, aber trotzdem super lecker.',
  },
];

export const AMENITIES = [
  { title: 'Speisen vor Ort & Außenbereich', detail: 'Gemütlicher Gastraum & Sitzplätze im Freien (Selbstbedienung)', icon: 'utensils' },
  { title: 'Schnelle Abholung', detail: 'Telefonisch bestellen & heiß mitnehmen · kein Lieferdienst', icon: 'bag' },
  { title: 'Kostenlose Parkplätze', detail: 'Viele freie Parkplätze direkt vor Ort & an der Straße', icon: 'car' },
  { title: 'Rollstuhlgerecht', detail: 'Barrierefreier Eingang, Sitzgelegenheiten & Parkplatz', icon: 'wheelchair' },
  { title: 'Familien & Hunde willkommen', detail: 'Kinderfreundlich mit Hochstühlen · Hunde sind erlaubt', icon: 'heart' },
  { title: 'Karte, NFC & Reservierung', detail: 'Debit-, Kreditkarte, NFC-Zahlung · Tischreservierung möglich', icon: 'card' },
] as const;
