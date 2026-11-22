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
  /** How the guest ordered, if the review says so */
  mode: 'vor-ort' | 'mitnehmen' | null;
  quote: string;
  /** Exact part of the quote that gets the marker highlight */
  highlight: string;
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

// Wörtliche Auszüge aus öffentlichen Google-Rezensionen (Nachnamen abgekürzt)
export const REVIEWS: ReviewItem[] = [
  {
    author: 'D. E.',
    rating: 5,
    mode: 'vor-ort',
    quote:
      'Das ist mit Abstand der beste Italiener weit und breit. Keiner kann dem Herren das Wasser reichen – jeder Besuch eine absolute zehn von zehn, Preis-Leistungs-Verhältnis absolut top!',
    highlight: 'der beste Italiener weit und breit',
  },
  {
    author: 'Joh. K.',
    rating: 5,
    mode: null,
    quote:
      'Preis-Leistung ist super! Die Pizzen sind ein Genuss! Der Service ist unglaublich schnell. Immer gerne wieder!',
    highlight: 'Die Pizzen sind ein Genuss!',
  },
  {
    author: 'Svenja S.',
    rating: 5,
    mode: 'vor-ort',
    quote:
      'Die Pizza war schnell fertig und hat sehr lecker geschmeckt. In dem Laden ist Selbstbedienung, ist aber nicht schlimm. Man kann drin gemütlich sitzen.',
    highlight: 'schnell fertig und hat sehr lecker geschmeckt',
  },
  {
    author: 'Sandra',
    rating: 5,
    mode: null,
    quote:
      'Das Essen war gut, Pizzateig schön dünn und lecker belegt, der Salat sehr reichhaltig mit Ei, Thunfisch und Käse – auch eine schöne Portion Eiweiß.',
    highlight: 'Pizzateig schön dünn und lecker belegt',
  },
  {
    author: 'Swester',
    rating: 5,
    mode: 'mitnehmen',
    quote:
      'Bestellen klappt einfach wunderbar! Wirklich gute Preise, ordentlich große Portionen und es schmeckt super lecker. Ab jetzt bestellen wir nur noch hier!',
    highlight: 'Ab jetzt bestellen wir nur noch hier!',
  },
  {
    author: 'Gerrit E.',
    rating: 5,
    mode: null,
    quote:
      'Super lecker, preislich unschlagbar. Kein richtiges Restaurant, nur Selbstbedienung, aber trotzdem super lecker.',
    highlight: 'preislich unschlagbar',
  },
];

export const AMENITIES = [
  { title: 'Drinnen oder draußen essen', detail: 'Gemütlicher Gastraum und Plätze im Freien. Bestellt wird am Tresen.', icon: 'utensils' },
  { title: 'Anrufen und abholen', detail: 'Telefonisch bestellen, heiß mitnehmen. Einen Lieferdienst gibt es nicht.', icon: 'bag' },
  { title: 'Parken direkt vor der Tür', detail: 'Kostenlose Parkplätze am Haus und an der Straße.', icon: 'parking' },
  { title: 'Barrierefrei', detail: 'Barrierefreier Eingang, passende Sitzplätze und Parkplatz.', icon: 'wheelchair' },
  { title: 'Kinder und Hunde willkommen', detail: 'Hochstühle sind da, Hunde dürfen mit hinein.', icon: 'heart' },
  { title: 'Kartenzahlung möglich', detail: 'Debit- und Kreditkarte, auch kontaktlos. Tische reservieren Sie per Telefon.', icon: 'card' },
] as const;
