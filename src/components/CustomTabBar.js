import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Text, Animated, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE } from '../constants/layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_WIDTH = (SCREEN_WIDTH - 32) / 4;

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const translateX = React.useRef(new Animated.Value(0)).current;
    const scale = React.useRef(new Animated.Value(1)).current;
    const translateY = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(translateX, {
            toValue: state.index * TAB_WIDTH,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
        }).start();
    }, [state.index]);

    const onPressIn = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 0.95,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
            }),
            Animated.spring(translateY, {
                toValue: -2,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
            })
        ]).start();
    };

    const onPressOut = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 7,
            })
        ]).start();
    };

    return (
        <View style={styles.container}>
            <Animated.View 
                style={[
                    styles.activeIndicator,
                    {
                        transform: [{ translateX }],
                    }
                ]} 
            />
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const getIconName = () => {
                    switch (route.name) {
                        case 'Home':
                            return 'home';
                        case 'Workout':
                            return 'dumbbell';
                        case 'Nutrition':
                            return 'food-apple';
                        case 'Profile':
                            return 'account';
                        default:
                            return 'home';
                    }
                };

                const getLabel = () => {
                    switch (route.name) {
                        case 'Home':
                            return 'Ana Sayfa';
                        case 'Workout':
                            return 'Antrenman';
                        case 'Nutrition':
                            return 'Beslenme';
                        case 'Profile':
                            return 'Profil';
                        default:
                            return '';
                    }
                };

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        onPressIn={onPressIn}
                        onPressOut={onPressOut}
                        style={[
                            styles.tabButton,
                            isFocused && styles.activeTabButton
                        ]}
                    >
                        <Animated.View style={{ 
                            transform: [{ scale }, { translateY }],
                            backgroundColor: isFocused ? colors.primary + '15' : 'transparent',
                            padding: 6,
                            borderRadius: 10,
                        }}>
                            <Icon
                                name={getIconName()}
                                size={22}
                                color={isFocused ? colors.primary : colors.textLight}
                            />
                        </Animated.View>
                        <View style={[
                            styles.labelContainer,
                            isFocused && styles.activeLabelContainer
                        ]}>
                            <Text style={[
                                styles.label,
                                isFocused && styles.activeLabel
                            ]}>
                                {getLabel()}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        paddingBottom: Platform.OS === 'ios' ? 16 : 8,
        paddingTop: 8,
        height: Platform.OS === 'ios' ? 75 : 60,
        position: 'relative',
        marginHorizontal: 16,
        marginBottom: Platform.OS === 'ios' ? 16 : 8,
        borderRadius: 16,
        shadowColor: colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    activeIndicator: {
        position: 'absolute',
        top: 8,
        left: 4,
        width: TAB_WIDTH - 8,
        height: 36,
        backgroundColor: colors.primary + '10',
        borderRadius: 10,
        zIndex: 0,
    },
    tabButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        zIndex: 1,
    },
    activeTabButton: {
        borderRadius: 10,
    },
    labelContainer: {
        marginTop: 2,
        paddingHorizontal: 4,
        borderRadius: 8,
    },
    activeLabelContainer: {
        backgroundColor: colors.primary + '15',
    },
    label: {
        fontSize: 11,
        color: colors.textLight,
        fontWeight: '500',
    },
    activeLabel: {
        color: colors.primary,
        fontWeight: '600',
    },
});

export default CustomTabBar; 

//denemedfasfasfsad