import { Tabs } from 'expo-router';
import { ColorValue, Text } from 'react-native';

function TabGlyph({ label, color }: { label: string; color: ColorValue }) {
  return <Text style={{ color, fontSize: 15, fontWeight: '700' }}>{label}</Text>;
}

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#2f6fde' }}>
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
