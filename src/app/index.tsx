import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Sun, SkyStrip } from '../components/Decor';
import { initialState, pickNext, recordAnswer, State } from '../scheduler';
import { useQuizState } from '../useQuizState';
import { colors, paperShadow } from '../theme';
import { Gender, WORDS, WORDS_BY_KEY, withIndefinite } from '../words';

const STORAGE_KEY = 'fr-genre-state-v1';
const WORD_KEYS = WORDS.map((w) => w.word);
const WORD_KEY_SET: ReadonlySet<string> = new Set(WORD_KEYS);
const CORRECT_ADVANCE_MS = 700;

type Feedback = { correct: boolean } | null;

export default function GenderScreen() {
  const [state, setState] = useQuizState(STORAGE_KEY, WORD_KEY_SET);
  const [current, setCurrent] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pick the first card once progress has loaded.
  useEffect(() => {
    if (state && !current) setCurrent(pickNext(state, WORD_KEYS));
  }, [state, current]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  if (!state || !current) return <View style={styles.container} />;

  const word = WORDS_BY_KEY[current];
  const reviewCount = Object.keys(state.review).length;
  const isReview = current in state.review;

  const next = (s: State) => {
    if (timer.current) clearTimeout(timer.current);
    setFeedback(null);
    setCurrent(pickNext(s, WORD_KEYS, current));
  };

  const guess = (g: Gender) => {
    if (feedback) return;
    const correct = g === word.gender;
    const updated = recordAnswer(state, current, correct);
    setState(updated);
    setFeedback({ correct });
    if (correct) timer.current = setTimeout(() => next(updated), CORRECT_ADVANCE_MS);
  };

  const reset = () =>
    Alert.alert('Reset progress?', 'This clears your score and review list.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          setState(initialState);
          next(initialState);
        },
      },
    ]);

  const bg = feedback ? (feedback.correct ? colors.leafWash : colors.rustWash) : colors.page;

  return (
    <Pressable
      style={[styles.container, { backgroundColor: bg }]}
      onPress={() => feedback && !feedback.correct && next(state)}
    >
      <SkyStrip />
      <View style={styles.header}>
        <Text style={styles.stat}>
          {state.correct}/{state.total}
          {state.total > 0 ? `  (${Math.round((100 * state.correct) / state.total)}%)` : ''}
        </Text>
        <Pressable onLongPress={reset} hitSlop={10}>
          <Text style={styles.stat}>To review: {reviewCount}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.sheet}>
          <Sun size={84} style={styles.sun} />
          <View style={styles.tagRow}>
            {isReview && !feedback && <Text style={styles.reviewTag}>review</Text>}
          </View>
          <Text style={styles.word} adjustsFontSizeToFit numberOfLines={1}>
            {word.word}
          </Text>
          <View style={styles.feedbackBox}>
            {feedback && (
              <>
                <Text
                  style={[styles.answer, { color: feedback.correct ? colors.leafDeep : colors.rust }]}
                >
                  {feedback.correct ? '✓ ' : '✗ '}
                  {withIndefinite(word)}
                </Text>
                <Text style={styles.english}>{word.english}</Text>
                {!feedback.correct && <Text style={styles.hint}>Tap anywhere to continue</Text>}
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={({ pressed }) => [styles.button, styles.m, pressed && styles.pressed]}
          onPress={() => guess('m')}
          disabled={!!feedback}
        >
          <Text style={styles.buttonText}>M</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, styles.f, pressed && styles.pressed]}
          onPress={() => guess('f')}
          disabled={!!feedback}
        >
          <Text style={styles.buttonText}>F</Text>
        </Pressable>
      </View>
      <StatusBar style="dark" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 64, paddingBottom: 24, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { fontSize: 16, fontWeight: '700', color: colors.white },
  card: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  sheet: {
    alignSelf: 'stretch',
    alignItems: 'center',
    backgroundColor: colors.paper,
    borderRadius: 28,
    borderWidth: 2.5,
    borderColor: colors.ink,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 6,
    boxShadow: paperShadow(6),
    transform: [{ rotate: '-1.5deg' }],
  },
  sun: { position: 'absolute', top: -44, right: -26 },
  tagRow: { height: 30, justifyContent: 'center' },
  reviewTag: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.wood,
    backgroundColor: colors.sunWash,
    borderWidth: 2,
    borderColor: colors.sun,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    overflow: 'hidden',
    transform: [{ rotate: '2deg' }],
  },
  word: { fontSize: 56, fontWeight: '800', color: colors.ink },
  feedbackBox: { height: 110, alignItems: 'center', justifyContent: 'flex-start', marginTop: 12 },
  answer: { fontSize: 28, fontWeight: '800' },
  english: { fontSize: 18, fontStyle: 'italic', color: colors.inkSoft, marginTop: 6 },
  hint: { fontSize: 14, color: colors.muted, marginTop: 14 },
  buttons: { flexDirection: 'row', gap: 16 },
  button: {
    flex: 1,
    height: 110,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: paperShadow(5),
  },
  m: { backgroundColor: colors.sky, transform: [{ rotate: '-2deg' }] },
  f: { backgroundColor: colors.beak, transform: [{ rotate: '2deg' }] },
  pressed: { boxShadow: paperShadow(1), transform: [{ translateY: 4 }] },
  buttonText: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.white,
    textShadowColor: colors.ink,
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
});
