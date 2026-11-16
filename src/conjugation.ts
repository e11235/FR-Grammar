/**
 * Conjugation data and question generation for the tenses used in everyday
 * spoken French. Literary tenses (passé simple, subjonctif imparfait, etc.)
 * are deliberately left out.
 */

export const TENSES = [
  'présent',
  'passé composé',
  'imparfait',
  'futur simple',
  'conditionnel présent',
  'subjonctif présent',
] as const;
export type Tense = (typeof TENSES)[number];

export const PERSONS = [
  { label: '1re pers. singulier', pronoun: 'je' },
  { label: '2e pers. singulier', pronoun: 'tu' },
  { label: '3e pers. singulier', pronoun: 'il' },
  { label: '1re pers. pluriel', pronoun: 'nous' },
  { label: '2e pers. pluriel', pronoun: 'vous' },
  { label: '3e pers. pluriel', pronoun: 'ils' },
] as const;

type Six = [string, string, string, string, string, string];

interface Verb {
  inf: string;
  en: string;
  present: Six;
  pp: string;
  aux: 'avoir' | 'être';
  futStem: string;
  /** Explicit subjonctif for verbs that don't follow the ils/nous stem rule. */
  subj?: Six;
  /** Explicit imparfait stem (only être needs it). */
  impStem?: string;
}

const AVOIR_PRESENT: Six = ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
const ETRE_PRESENT: Six = ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'];

const IMP_ENDINGS = ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'];
const FUT_ENDINGS = ['ai', 'as', 'a', 'ons', 'ez', 'ont'];
const SUBJ_ENDINGS = ['e', 'es', 'e', 'ions', 'iez', 'ent'];

/** Attach an ending, undoing the spelling tweaks of -ger/-cer verbs before "i". */
function join(stem: string, ending: string): string {
  if (ending.startsWith('i')) {
    if (stem.endsWith('ge')) stem = stem.slice(0, -1);
    else if (stem.endsWith('ç')) stem = stem.slice(0, -1) + 'c';
  }
  return stem + ending;
}

function er(inf: string, en: string, aux: Verb['aux'] = 'avoir'): Verb {
  const s = inf.slice(0, -2);
  const nous = s.endsWith('g') ? s + 'e' : s.endsWith('c') ? s.slice(0, -1) + 'ç' : s;
  return {
    inf,
    en,
    aux,
    present: [s + 'e', s + 'es', s + 'e', nous + 'ons', s + 'ez', s + 'ent'],
    pp: s + 'é',
    futStem: inf,
  };
}

function ir(inf: string, en: string): Verb {
  const s = inf.slice(0, -2);
  return {
    inf,
    en,
    aux: 'avoir',
    present: [s + 'is', s + 'is', s + 'it', s + 'issons', s + 'issez', s + 'issent'],
    pp: s + 'i',
    futStem: inf,
  };
}

function re(inf: string, en: string): Verb {
  const s = inf.slice(0, -2);
  return {
    inf,
    en,
    aux: 'avoir',
    present: [s + 's', s + 's', s, s + 'ons', s + 'ez', s + 'ent'],
    pp: s + 'u',
    futStem: inf.slice(0, -1),
  };
}

function irr(
  inf: string,
  en: string,
  present: Six,
  pp: string,
  extra: Partial<Pick<Verb, 'aux' | 'futStem' | 'subj' | 'impStem'>> = {},
): Verb {
  return {
    inf,
    en,
    present,
    pp,
    aux: extra.aux ?? 'avoir',
    futStem: extra.futStem ?? (inf.endsWith('re') ? inf.slice(0, -1) : inf),
    subj: extra.subj,
    impStem: extra.impStem,
  };
}

export const VERBS: Verb[] = [
  irr('être', 'to be', ETRE_PRESENT, 'été', {
    futStem: 'ser',
    impStem: 'ét',
    subj: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'],
  }),
  irr('avoir', 'to have', AVOIR_PRESENT, 'eu', {
    futStem: 'aur',
    subj: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'],
  }),
  irr('aller', 'to go', ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], 'allé', {
    aux: 'être',
    futStem: 'ir',
    subj: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'],
  }),
  irr('faire', 'to do / make', ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], 'fait', {
    futStem: 'fer',
    subj: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'],
  }),
  irr('dire', 'to say', ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], 'dit'),
  irr('pouvoir', 'to be able to', ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'], 'pu', {
    futStem: 'pourr',
    subj: ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent'],
  }),
  irr('vouloir', 'to want', ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'], 'voulu', {
    futStem: 'voudr',
    subj: ['veuille', 'veuilles', 'veuille', 'voulions', 'vouliez', 'veuillent'],
  }),
  irr('savoir', 'to know', ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'], 'su', {
    futStem: 'saur',
    subj: ['sache', 'saches', 'sache', 'sachions', 'sachiez', 'sachent'],
  }),
  irr('devoir', 'to have to / owe', ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'], 'dû', {
    futStem: 'devr',
  }),
  irr('venir', 'to come', ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], 'venu', {
    aux: 'être',
    futStem: 'viendr',
  }),
  irr('voir', 'to see', ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'], 'vu', {
    futStem: 'verr',
  }),
  irr('prendre', 'to take', ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'], 'pris'),
  irr(
    'comprendre',
    'to understand',
    ['comprends', 'comprends', 'comprend', 'comprenons', 'comprenez', 'comprennent'],
    'compris',
  ),
  irr('mettre', 'to put', ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'], 'mis'),
  irr('boire', 'to drink', ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'], 'bu'),
  irr('écrire', 'to write', ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'], 'écrit'),
  irr('lire', 'to read', ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'], 'lu'),
  irr('croire', 'to believe', ['crois', 'crois', 'croit', 'croyons', 'croyez', 'croient'], 'cru'),
  irr(
    'connaître',
    'to know (be familiar with)',
    ['connais', 'connais', 'connaît', 'connaissons', 'connaissez', 'connaissent'],
    'connu',
  ),
  irr('vivre', 'to live', ['vis', 'vis', 'vit', 'vivons', 'vivez', 'vivent'], 'vécu'),
  irr('recevoir', 'to receive', ['reçois', 'reçois', 'reçoit', 'recevons', 'recevez', 'reçoivent'], 'reçu', {
    futStem: 'recevr',
  }),
  irr('partir', 'to leave', ['pars', 'pars', 'part', 'partons', 'partez', 'partent'], 'parti', {
    aux: 'être',
  }),
  irr('sortir', 'to go out', ['sors', 'sors', 'sort', 'sortons', 'sortez', 'sortent'], 'sorti', {
    aux: 'être',
  }),
  irr('dormir', 'to sleep', ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment'], 'dormi'),
  irr('ouvrir', 'to open', ['ouvre', 'ouvres', 'ouvre', 'ouvrons', 'ouvrez', 'ouvrent'], 'ouvert'),
  er('parler', 'to speak'),
  er('aimer', 'to like / love'),
  er('donner', 'to give'),
  er('trouver', 'to find'),
  er('penser', 'to think'),
  er('regarder', 'to watch'),
  er('travailler', 'to work'),
  er('habiter', 'to live (somewhere)'),
  er('manger', 'to eat'),
  er('commencer', 'to start'),
  er('arriver', 'to arrive', 'être'),
  er('rester', 'to stay', 'être'),
  er('tomber', 'to fall', 'être'),
  er('entrer', 'to enter', 'être'),
  ir('finir', 'to finish'),
  ir('choisir', 'to choose'),
  re('attendre', 'to wait'),
  re('vendre', 'to sell'),
  re('répondre', 'to answer'),
  re('entendre', 'to hear'),
];

const VERBS_BY_INF: Record<string, Verb> = Object.fromEntries(VERBS.map((v) => [v.inf, v]));

/** Returns the conjugated form (without subject pronoun). */
export function conjugate(v: Verb, tense: Tense, p: number): string {
  switch (tense) {
    case 'présent':
      return v.present[p];
    case 'passé composé': {
      if (v.aux === 'avoir') return `${AVOIR_PRESENT[p]} ${v.pp}`;
      // Être verbs agree with the subject; we use the masculine form.
      const pp = p >= 3 && !v.pp.endsWith('s') ? v.pp + 's' : v.pp;
      return `${ETRE_PRESENT[p]} ${pp}`;
    }
    case 'imparfait': {
      const stem = v.impStem ?? v.present[3].slice(0, -3);
      return join(stem, IMP_ENDINGS[p]);
    }
    case 'futur simple':
      return v.futStem + FUT_ENDINGS[p];
    case 'conditionnel présent':
      return v.futStem + IMP_ENDINGS[p];
    case 'subjonctif présent': {
      if (v.subj) return v.subj[p];
      const stem = p === 3 || p === 4 ? v.present[3].slice(0, -3) : v.present[5].slice(0, -3);
      return join(stem, SUBJ_ENDINGS[p]);
    }
  }
}

export interface Question {
  key: string;
  verb: Verb;
  tense: Tense;
  person: number;
  answer: string;
  options: string[];
}

/** Every (verb, person, tense) combination, keyed as "inf|person|tense". */
export const QUESTION_KEYS: string[] = VERBS.flatMap((v) =>
  TENSES.flatMap((t) => PERSONS.map((_, p) => `${v.inf}|${p}|${t}`)),
);
export const QUESTION_KEY_SET: ReadonlySet<string> = new Set(QUESTION_KEYS);

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Builds a question with 3 distractors drawn from the same verb: mostly the
 * same person in other tenses (tests tense knowledge), plus one from the same
 * tense with a different person (tests endings). Distractors are always
 * different strings from the answer, so exactly one option is correct.
 */
export function buildQuestion(key: string): Question {
  const [inf, personStr, tense] = key.split('|') as [string, string, Tense];
  const verb = VERBS_BY_INF[inf];
  const person = Number(personStr);
  const answer = conjugate(verb, tense, person);

  const otherTenses = shuffle(
    TENSES.filter((t) => t !== tense).map((t) => conjugate(verb, t, person)),
  );
  const otherPersons = shuffle(
    PERSONS.map((_, p) => p)
      .filter((p) => p !== person)
      .map((p) => conjugate(verb, tense, p)),
  );

  const chosen = new Set<string>([answer]);
  const take = (list: string[], n: number) => {
    for (const f of list) {
      if (n === 0) break;
      if (!chosen.has(f)) {
        chosen.add(f);
        n--;
      }
    }
  };
  take(otherTenses, 2);
  take(otherPersons, 1);
  // Top up if duplicates left us short.
  take([...otherTenses, ...otherPersons], 4 - chosen.size);

  return { key, verb, tense, person, answer, options: shuffle([...chosen]) };
}
