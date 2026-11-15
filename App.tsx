import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { initialState, pickNext, recordAnswer, State } from './src/scheduler';
import { Gender, WORDS_BY_KEY, withIndefinite } from './src/words';

const STORAGE_KEY = 'fr-genre-state-v1';
const CORRECT_ADVANCE_MS = 700;

type Feedback = { correct: boolean } | null;

export default function App() {
  const [state, setState] = useState<State | null>(null);
  const [current, setCurrent] = useState<string>('');
  const [feedback, setFeedback] = useState<Feedback>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved progress.
  useEffect(() => {
    (async () => {
      let loaded = initialState;
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) loaded = { ...initialState, ...JSON.parse(raw) };
      } catch {}
      // Drop review entries for words no longer in the list.
      loaded.review = Object.fromEntries(
        Object.entries(loaded.review).filter(([w]) => w in WORDS_BY_KEY),
      );
      setState(loaded);
      setCurrent(pickNext(loaded));
    })();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  // Save whenever progress changes.
  useEffect(() => {
    if (state) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  if (!state || !current) return <View style={styles.container} />;

  const word = WORDS_BY_KEY[current];
  const reviewCount = Object.keys(state.review).length;
  const isReview = current in state.review;

  const next = (s: State) => {
    if (timer.current) clearTimeout(timer.current);
    setFeedback(null);
    setCurrent(pickNext(s, current));
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

  const bg = feedback ? (feedback.correct ? '#e7f7ec' : '#fdecec') : '#fff';

  return (
    <Pressable
      style={[styles.container, { backgroundColor: bg }]}
      onPress={() => feedback && !feedback.correct && next(state)}
    >
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
        {isReview && !feedback && <Text style={styles.reviewTag}>review</Text>}
        <Text style={styles.word} adjustsFontSizeToFit numberOfLines={1}>
          {word.word}
        </Text>
        <View style={styles.feedbackBox}>
          {feedback && (
            <>
              <Text style={[styles.answer, { color: feedback.correct ? '#1e7b3a' : '#b42318' }]}>
                {feedback.correct ? '✓ ' : '✗ '}
                {withIndefinite(word)}
              </Text>
              <Text style={styles.english}>{word.english}</Text>
              {!feedback.correct && <Text style={styles.hint}>Tap anywhere to continue</Text>}
            </>
          )}
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
  container: { flex: 1, paddingTop: 64, paddingBottom: 48, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { fontSize: 16, color: '#555' },
  card: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  reviewTag: {
    fontSize: 13,
    color: '#8a5a00',
    backgroundColor: '#fff3d6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  word: { fontSize: 56, fontWeight: '600', color: '#111' },
  feedbackBox: { height: 110, alignItems: 'center', justifyContent: 'flex-start', marginTop: 16 },
  answer: { fontSize: 28, fontWeight: '600' },
  english: { fontSize: 18, color: '#666', marginTop: 6 },
  hint: { fontSize: 14, color: '#999', marginTop: 14 },
  buttons: { flexDirection: 'row', gap: 16 },
  button: {
    flex: 1,
    height: 110,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  m: { backgroundColor: '#2f6fde' },
  f: { backgroundColor: '#d6336c' },
  pressed: { opacity: 0.7 },
  buttonText: { fontSize: 44, fontWeight: '700', color: '#fff' },
});
