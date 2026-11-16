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
import { SkyStrip, Sun } from '../components/Decor';
import { initialState, pickNext, recordAnswer, State } from '../scheduler';
import { colors, paperShadow } from '../theme';
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

  const bg = answered ? (correct ? colors.leafWash : colors.rustWash) : colors.page;

  return (
    <Pressable
      style={[styles.container, { backgroundColor: bg }]}
      onPress={() => answered && !correct && next(state)}
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
          <Sun size={72} style={styles.sun} />
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
    paddingTop: 14,
    paddingBottom: 20,
    boxShadow: paperShadow(6),
    transform: [{ rotate: '1.2deg' }],
  },
  sun: { position: 'absolute', top: -38, left: -22 },
  tagRow: { height: 34, justifyContent: 'center' },
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
    transform: [{ rotate: '-2deg' }],
  },
  verb: { fontSize: 48, fontWeight: '800', color: colors.ink },
  english: { fontSize: 16, fontStyle: 'italic', color: colors.muted, marginTop: 4 },
  prompt: { fontSize: 20, fontWeight: '600', color: colors.inkSoft, marginTop: 20 },
  tense: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    backgroundColor: colors.leaf,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
    transform: [{ rotate: '-1.5deg' }],
  },
  options: { gap: 12 },
  option: {
    height: 60,
    borderRadius: 18,
    borderWidth: 2.5,
    borderColor: colors.ink,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: paperShadow(4),
  },
  optionCorrect: { backgroundColor: colors.leaf },
  optionWrong: { backgroundColor: colors.rust },
  optionText: { fontSize: 22, fontWeight: '700', color: colors.ink },
  optionTextOnColor: { color: colors.white },
  pressed: { boxShadow: paperShadow(1), transform: [{ translateY: 3 }], backgroundColor: colors.sunWash },
  hint: { fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 4 },
});
