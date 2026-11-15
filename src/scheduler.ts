import { WORDS } from './words';

/**
 * Words you miss go into a review queue. Each review item is "due" after a
 * number of cards. Getting it right pushes it further out; getting it wrong
 * resets it. After enough correct answers in a row it graduates out.
 */
export const REVIEW_INTERVALS = [3, 8, 20]; // cards until next showing, by streak
const GRADUATE_AFTER = REVIEW_INTERVALS.length;

export interface ReviewItem {
  due: number; // turn number at which it should be shown again
  streak: number; // consecutive correct answers since last miss
}

export interface State {
  turn: number;
  review: Record<string, ReviewItem>;
  correct: number;
  total: number;
}

export const initialState: State = { turn: 0, review: {}, correct: 0, total: 0 };

export function pickNext(state: State, current?: string): string {
  // Earliest-due review word that's ready (and isn't the one just shown).
  const due = Object.entries(state.review)
    .filter(([w, r]) => r.due <= state.turn && w !== current)
    .sort((a, b) => a[1].due - b[1].due);
  if (due.length > 0) return due[0][0];

  // Otherwise a random word that isn't waiting in the review queue.
  const pool = WORDS.filter((w) => !(w.word in state.review) && w.word !== current);
  const source = pool.length > 0 ? pool : WORDS;
  return source[Math.floor(Math.random() * source.length)].word;
}

export function recordAnswer(state: State, word: string, correct: boolean): State {
  const turn = state.turn + 1;
  const review = { ...state.review };
  const existing = review[word];

  if (!correct) {
    review[word] = { due: turn + REVIEW_INTERVALS[0], streak: 0 };
  } else if (existing) {
    const streak = existing.streak + 1;
    if (streak >= GRADUATE_AFTER) delete review[word];
    else review[word] = { due: turn + REVIEW_INTERVALS[streak], streak };
  }

  return {
    turn,
    review,
    correct: state.correct + (correct ? 1 : 0),
    total: state.total + 1,
  };
}
