import { Tabs } from 'expo-router';
import { ColorValue, Text } from 'react-native';
import { colors } from '../theme';

function TabGlyph({ label, color }: { label: string; color: ColorValue }) {
  return <Text style={{ color, fontSize: 16, fontWeight: '900' }}>{label}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.beakDeep,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontWeight: '700' },
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopWidth: 2.5,
          borderTopColor: colors.ink,
        },
        sceneStyle: { backgroundColor: colors.page },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Genre',
          tabBarIcon: ({ color }) => <TabGlyph label="le/la" color={color} />,
        }}
      />
      <Tabs.Screen
        name="conjugaison"
        options={{
          title: 'Conjugaison',
          tabBarIcon: ({ color }) => <TabGlyph label="-er" color={color} />,
        }}
      />
    </Tabs>
  );
}
