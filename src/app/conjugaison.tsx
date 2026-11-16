import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  buildQuestion,
  PERSONS,
  Question,
  QUESTION_KEY_SET,
  QUESTION_KEYS,
} from '../conjugation';
import { initialState, pickNext, recordAnswer, State } from '../scheduler';
import { useQuizState } from '../useQuizState';

const STORAGE_KEY = 'fr-conjugaison-state-v1';
const CORRECT_ADVANCE_MS = 900;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ConjugationScreen() {
  const [state, setState] = useQuizState(STORAGE_KEY, QUESTION_KEY_SET);
  const [question, setQuestion] = useState<Question | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (state && !question) setQuestion(buildQuestion(pickNext(state, QUESTION_KEYS)));
  }, [state, question]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  if (!state || !question) return <View style={styles.container} />;

  const reviewCount = Object.keys(state.review).length;
  const isReview = question.key in state.review;
  const answered = picked !== null;
  const correct = picked === question.answer;
  const person = PERSONS[question.person];

  const next = (s: State) => {
    if (timer.current) clearTimeout(timer.current);
    setPicked(null);
    setQuestion(buildQuestion(pickNext(s, QUESTION_KEYS, question.key)));
  };

  const choose = (option: string) => {
    if (answered) return;
    const ok = option === question.answer;
    const updated = recordAnswer(state, question.key, ok);
    setState(updated);
    setPicked(option);
    if (ok) timer.current = setTimeout(() => next(updated), CORRECT_ADVANCE_MS);
  };

  const reset = () =>
    Alert.alert('Reset progress?', 'This clears your conjugation score and review list.', [
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

  const bg = answered ? (correct ? '#e7f7ec' : '#fdecec') : '#fff';

  return (
    <Pressable
      style={[styles.container, { backgroundColor: bg }]}
      onPress={() => answered && !correct && next(state)}
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
        <View style={styles.tagRow}>
          {isReview && !answered && <Text style={styles.reviewTag}>review</Text>}
        </View>
        <Text style={styles.verb} adjustsFontSizeToFit numberOfLines={1}>
          {capitalize(question.verb.inf)}
        </Text>
        <Text style={styles.english}>{question.verb.en}</Text>
        <Text style={styles.prompt}>
          {person.label} ({person.pronoun})
        </Text>
        <Text style={styles.tense}>{question.tense}</Text>
      </View>

      <View style={styles.options}>
        {question.options.map((option) => {
          const isAnswer = option === question.answer;
          const isPicked = option === picked;
          return (
            <Pressable
              key={option}
              style={({ pressed }) => [
                styles.option,
                answered && isAnswer && styles.optionCorrect,
                answered && isPicked && !isAnswer && styles.optionWrong,
                pressed && !answered && styles.pressed,
              ]}
              onPress={() => (answered ? !correct && next(state) : choose(option))}
            >
              <Text
                style={[
                  styles.optionText,
                  answered && (isAnswer || isPicked) && styles.optionTextOnColor,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
        <Text style={styles.hint}>{answered && !correct ? 'Tap anywhere to continue' : ' '}</Text>
      </View>
      <StatusBar style="dark" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 64, paddingBottom: 16, paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  stat: { fontSize: 16, color: '#555' },
  card: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tagRow: { height: 34 },
  reviewTag: {
    fontSize: 13,
    color: '#8a5a00',
    backgroundColor: '#fff3d6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    overflow: 'hidden',
  },
  verb: { fontSize: 48, fontWeight: '600', color: '#111' },
  english: { fontSize: 16, color: '#888', marginTop: 4 },
  prompt: { fontSize: 20, color: '#333', marginTop: 20 },
  tense: { fontSize: 22, fontWeight: '600', color: '#2f6fde', marginTop: 6 },
  options: { gap: 12 },
  option: {
    height: 60,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#d8dce3',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCorrect: { backgroundColor: '#1e7b3a', borderColor: '#1e7b3a' },
  optionWrong: { backgroundColor: '#b42318', borderColor: '#b42318' },
  optionText: { fontSize: 22, fontWeight: '500', color: '#111' },
  optionTextOnColor: { color: '#fff' },
  pressed: { opacity: 0.6 },
  hint: { fontSize: 14, color: '#999', textAlign: 'center', marginTop: 4 },
});
