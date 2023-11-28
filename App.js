import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// [BUG] package @expo/vector-icons perlu di install agar bisa menggunakan icon
import { FontAwesome5 } from '@expo/vector-icons';
import { AboutScreen, TaskCompletedScreen, TaskScreen } from './screens';
// [IMPROVEMENT] tambah package flash-message untuk memunculkan alert lebih cantik
import FlashMessage from 'react-native-flash-message';
import {SafeAreaProvider} from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Task') {
            iconName = 'tasks';
          } else if (route.name === 'Completed') {
            iconName = 'clipboard-check';
          } else if (route.name === 'About') {
            iconName = 'exclamation-circle';
          }
          return (
            <FontAwesome5
              name={iconName}
              size={size}
              color={focused ? 'navy' : color}
            />
          );
        },
        tabBarIconStyle: { marginTop: 10 },
        tabBarLabel: ({ children, color, focused }) => {
          return (
            <Text style={{ marginBottom: 10, color: focused ? 'navy' : color }}>
              {children}
            </Text>
          );
        },
        tabBarStyle: {
          height: 70,
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen
        name="Task"
        component={TaskScreen}
        options={{ title: 'Tasks', unmountOnBlur: true }}
      />
      <Tab.Screen
        name="Completed"
        component={TaskCompletedScreen}
        options={{ title: 'Completed Tasks', unmountOnBlur: true }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{ unmountOnBlur: true }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="BottomNavigator"
            component={BottomNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      {/*Setelah import FlashMessage pasang di global element aplikasi agar alert tersedia di semua halaman*/}
      <FlashMessage position="top" />
    </SafeAreaProvider>
  );
};

export default App;
