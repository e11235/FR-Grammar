export type Gender = 'm' | 'f';

export interface Word {
  word: string;
  gender: Gender;
  english: string;
}

// Common nouns with a single, unambiguous gender. Includes plenty of "traps"
// (masculine words ending in -e, feminine words ending in -age, etc.).
const masculine: [string, string][] = [
  ['chat', 'cat'], ['chien', 'dog'], ['arbre', 'tree'], ['soleil', 'sun'],
  ['jour', 'day'], ['pain', 'bread'], ['fromage', 'cheese'], ['vin', 'wine'],
  ['lait', 'milk'], ['café', 'coffee'], ['thé', 'tea'], ['gâteau', 'cake'],
  ['bateau', 'boat'], ['train', 'train'], ['avion', 'plane'], ['vélo', 'bike'],
  ['stylo', 'pen'], ['crayon', 'pencil'], ['cahier', 'notebook'], ['bureau', 'desk / office'],
  ['ordinateur', 'computer'], ['téléphone', 'phone'], ['lit', 'bed'], ['mur', 'wall'],
  ['toit', 'roof'], ['jardin', 'garden'], ['parc', 'park'], ['pont', 'bridge'],
  ['musée', 'museum'], ['magasin', 'shop'], ['marché', 'market'], ['restaurant', 'restaurant'],
  ['hôtel', 'hotel'], ['hôpital', 'hospital'], ['aéroport', 'airport'], ['pays', 'country'],
  ['monde', 'world'], ['ciel', 'sky'], ['nuage', 'cloud'], ['vent', 'wind'],
  ['feu', 'fire'], ['problème', 'problem'], ['système', 'system'], ['programme', 'program'],
  ['thème', 'theme'], ['poème', 'poem'], ['climat', 'climate'], ['silence', 'silence'],
  ['lycée', 'high school'], ['sourire', 'smile'], ['groupe', 'group'], ['verre', 'glass'],
  ['miroir', 'mirror'], ['couloir', 'hallway'], ['escalier', 'staircase'], ['plafond', 'ceiling'],
  ['sac', 'bag'], ['manteau', 'coat'], ['chapeau', 'hat'], ['pantalon', 'trousers'],
  ['journal', 'newspaper'], ['message', 'message'], ['voyage', 'trip'], ['village', 'village'],
  ['visage', 'face'], ['courage', 'courage'], ['mariage', 'wedding'], ['légume', 'vegetable'],
  ['fruit', 'fruit'], ['poisson', 'fish'], ['poulet', 'chicken'], ['œuf', 'egg'],
  ['riz', 'rice'], ['sel', 'salt'], ['sucre', 'sugar'], ['beurre', 'butter'],
  ['miel', 'honey'], ['couteau', 'knife'], ['four', 'oven'], ['réveil', 'alarm clock'],
  ['cerveau', 'brain'], ['cœur', 'heart'], ['bras', 'arm'], ['pied', 'foot'],
  ['genou', 'knee'], ['cou', 'neck'], ['dos', 'back'], ['ventre', 'belly'],
  ['doigt', 'finger'], ['œil', 'eye'], ['nez', 'nose'], ['choix', 'choice'],
  ['prix', 'price'], ['travail', 'work'], ['métier', 'trade / job'], ['rêve', 'dream'],
  ['sommeil', 'sleep'], ['moment', 'moment'], ['mois', 'month'], ['siècle', 'century'],
  ['hiver', 'winter'], ['été', 'summer'], ['automne', 'autumn'], ['printemps', 'spring'],
  ['matin', 'morning'], ['soir', 'evening'], ['dictionnaire', 'dictionary'], ['parapluie', 'umbrella'],
  ['incendie', 'fire (blaze)'], ['génie', 'genius'], ['modèle', 'model'], ['rôle', 'role'],
  ['contrôle', 'check / control'], ['peigne', 'comb'], ['signe', 'sign'], ['domaine', 'domain'],
  ['stade', 'stadium'], ['squelette', 'skeleton'], ['bonheur', 'happiness'], ['malheur', 'misfortune'],
  ['honneur', 'honour'], ['espace', 'space'], ['lieu', 'place'], ['film', 'film'],
  ['livre', 'book'], ['animal', 'animal'], ['oiseau', 'bird'], ['cheval', 'horse'],
  ['sandwich', 'sandwich'], ['gymnase', 'gym'], ['vase', 'vase'], ['casque', 'helmet'],
];

const feminine: [string, string][] = [
  ['maison', 'house'], ['voiture', 'car'], ['table', 'table'], ['chaise', 'chair'],
  ['porte', 'door'], ['fenêtre', 'window'], ['cuisine', 'kitchen'], ['chambre', 'bedroom'],
  ['rue', 'street'], ['ville', 'city'], ['plage', 'beach'], ['mer', 'sea'],
  ['montagne', 'mountain'], ['rivière', 'river'], ['forêt', 'forest'], ['fleur', 'flower'],
  ['lune', 'moon'], ['terre', 'earth'], ['étoile', 'star'], ['pluie', 'rain'],
  ['neige', 'snow'], ['nuit', 'night'], ['semaine', 'week'], ['année', 'year'],
  ['journée', 'day (duration)'], ['soirée', 'evening / party'], ['heure', 'hour'], ['minute', 'minute'],
  ['fois', 'time (occurrence)'], ['vie', 'life'], ['mort', 'death'], ['main', 'hand'],
  ['tête', 'head'], ['bouche', 'mouth'], ['jambe', 'leg'], ['épaule', 'shoulder'],
  ['oreille', 'ear'], ['dent', 'tooth'], ['peau', 'skin'], ['voix', 'voice'],
  ['pomme', 'apple'], ['orange', 'orange'], ['banane', 'banana'], ['fraise', 'strawberry'],
  ['poire', 'pear'], ['carotte', 'carrot'], ['salade', 'salad'], ['soupe', 'soup'],
  ['viande', 'meat'], ['eau', 'water'], ['bière', 'beer'], ['tasse', 'cup'],
  ['assiette', 'plate'], ['fourchette', 'fork'], ['cuillère', 'spoon'], ['bouteille', 'bottle'],
  ['clé', 'key'], ['lampe', 'lamp'], ['horloge', 'clock'], ['chemise', 'shirt'],
  ['robe', 'dress'], ['jupe', 'skirt'], ['veste', 'jacket'], ['chaussure', 'shoe'],
  ['cravate', 'tie'], ['lettre', 'letter'], ['page', 'page'], ['photo', 'photo'],
  ['image', 'picture'], ['chanson', 'song'], ['musique', 'music'], ['histoire', 'story / history'],
  ['langue', 'language / tongue'], ['question', 'question'], ['réponse', 'answer'], ['idée', 'idea'],
  ['raison', 'reason'], ['chose', 'thing'], ['façon', 'way'], ['liberté', 'freedom'],
  ['société', 'society / company'], ['université', 'university'], ['santé', 'health'], ['beauté', 'beauty'],
  ['vérité', 'truth'], ['gare', 'train station'], ['école', 'school'], ['église', 'church'],
  ['banque', 'bank'], ['boulangerie', 'bakery'], ['pharmacie', 'pharmacy'], ['bibliothèque', 'library'],
  ['librairie', 'bookshop'], ['entreprise', 'company'], ['nation', 'nation'], ['télévision', 'television'],
  ['radio', 'radio'], ['moto', 'motorbike'], ['souris', 'mouse'], ['croix', 'cross'],
  ['noix', 'walnut'], ['faim', 'hunger'], ['soif', 'thirst'], ['fin', 'end'],
  ['peur', 'fear'], ['couleur', 'colour'], ['chaleur', 'heat'], ['odeur', 'smell'],
  ['leçon', 'lesson'], ['saison', 'season'], ['prison', 'prison'], ['boisson', 'drink'],
  ['cage', 'cage'], ['personne', 'person'], ['victime', 'victim'], ['recette', 'recipe'],
  ['serviette', 'towel / napkin'], ['baguette', 'baguette'], ['famille', 'family'], ['ferme', 'farm'],
  ['île', 'island'], ['route', 'road'], ['place', 'square / seat'], ['brosse', 'brush'],
  ['part', 'share / portion'], ['chair', 'flesh'], ['dent', 'tooth'], ['clinique', 'clinic'],
];

const seen = new Set<string>();
export const WORDS: Word[] = [
  ...masculine.map(([word, english]) => ({ word, english, gender: 'm' as const })),
  ...feminine.map(([word, english]) => ({ word, english, gender: 'f' as const })),
].filter((w) => (seen.has(w.word) ? false : (seen.add(w.word), true)));

export const WORDS_BY_KEY: Record<string, Word> = Object.fromEntries(
  WORDS.map((w) => [w.word, w]),
);

/** "un chat", "une maison" — always shows the gender, even before vowels. */
export function withIndefinite(w: Word): string {
  return `${w.gender === 'm' ? 'un' : 'une'} ${w.word}`;
}
