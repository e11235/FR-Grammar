import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../theme';

const RAYS = 14;

/** A cut-paper sun: a disc with uneven rays. Purely decorative. */
export function Sun({ size = 90, style }: { size?: number; style?: ViewStyle }) {
  const disc = size * 0.55;
  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, style]}>
      {Array.from({ length: RAYS }, (_, i) => {
        const long = i % 2 === 0;
        return (
          <View
            key={i}
            style={[
              StyleSheet.absoluteFill,
              { alignItems: 'center', transform: [{ rotate: `${(360 / RAYS) * i}deg` }] },
            ]}
          >
            <View
              style={{
                width: long ? 4 : 3,
                height: long ? size * 0.2 : size * 0.14,
                marginTop: long ? 0 : size * 0.05,
                borderRadius: 2,
                backgroundColor: long ? colors.sun : colors.beak,
                opacity: long ? 1 : 0.8,
              }}
            />
          </View>
        );
      })}
      <View
        style={{
          position: 'absolute',
          left: (size - disc) / 2,
          top: (size - disc) / 2,
          width: disc,
          height: disc,
          borderRadius: disc / 2,
          backgroundColor: colors.sun,
          borderWidth: 3,
          borderColor: '#e9a92a',
        }}
      />
    </View>
  );
}

/** A soft paper cloud for the sky strip. */
export function Cloud({ width = 60, style }: { width?: number; style?: ViewStyle }) {
  const h = width * 0.32;
  return (
    <View pointerEvents="none" style={[{ width, height: h * 1.5 }, style]}>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width,
          height: h,
          borderRadius: h / 2,
          backgroundColor: colors.cloud,
          opacity: 0.55,
        }}
      />
      <View
        style={{
          position: 'absolute',
          left: width * 0.25,
          top: 0,
          width: width * 0.45,
          height: h * 1.2,
          borderRadius: h,
          backgroundColor: colors.cloud,
          opacity: 0.55,
        }}
      />
    </View>
  );
}

/** Sky-blue strip that sits behind the score header. */
export function SkyStrip() {
  return (
    <View pointerEvents="none" style={decor.sky}>
      <Cloud width={70} style={{ position: 'absolute', left: 30, bottom: 6 }} />
      <Cloud width={46} style={{ position: 'absolute', right: 120, bottom: 14 }} />
      <Cloud width={58} style={{ position: 'absolute', right: 24, bottom: 2 }} />
    </View>
  );
}

const decor = StyleSheet.create({
  sky: {
    position: 'absolute',
    top: -40,
    left: -30,
    right: -30,
    height: 150,
    backgroundColor: colors.sky,
    transform: [{ rotate: '-2deg' }],
    overflow: 'hidden',
  },
});
