# FR Genre

A tiny Expo / React Native app for practising French noun genders.

- A word is shown; tap **M** or **F**.
- Correct answers auto-advance; wrong ones show the answer (`un/une …` + English) — tap to continue.
- Missed words go into a review queue and come back after 3, then 8, then 20 cards. Three correct in a row and they graduate out; a miss resets them.
- Progress is saved on the device. Long-press "To review" to reset.

## Run

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

Words live in `src/words.ts`; review timing is in `src/scheduler.ts`.
