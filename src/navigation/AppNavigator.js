import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import HomeScreen from '../screens/HomeScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import DailyGoalsScreen from '../screens/DailyGoalsScreen';
import WorkoutScheduleScreen from '../screens/WorkoutScheduleScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditGoalsScreen from '../screens/EditGoalsScreen';

import { colors } from '../theme/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Workout':
                            iconName = focused ? 'dumbbell' : 'dumbbell';
                            break;
                        case 'Profile':
                            iconName = focused ? 'account' : 'account-outline';
                            break;
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textLight,
                headerShown: false,
                tabBarStyle: {
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    paddingBottom: 5,
                    paddingTop: 5,
                },
            })}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeScreen}
                options={{ title: 'Ana Sayfa' }}
            />
            <Tab.Screen 
                name="Workout" 
                component={WorkoutScreen}
                options={{ title: 'Antrenman' }}
            />
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{ title: 'Profil' }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="MainTabs" component={MainTabs} />
                <Stack.Screen name="Notifications" component={NotificationsScreen} />
                <Stack.Screen name="DailyGoals" component={DailyGoalsScreen} />
                <Stack.Screen name="WorkoutSchedule" component={WorkoutScheduleScreen} />
                <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
                <Stack.Screen name="Settingss" component={SettingsScreen} />
                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                <Stack.Screen name="EditGoals" component={EditGoalsScreen} />
                
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator; 