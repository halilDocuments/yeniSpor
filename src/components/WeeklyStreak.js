import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WeeklyStreak = ({ streak = 1 }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Haftalık Seri</Text>
            <View style={styles.streakContainer}>
                {[...Array(5)].map((_, index) => (
                    <View 
                        key={index} 
                        style={[
                            styles.fireIconContainer,
                            index < streak && styles.activeFireContainer
                        ]}
                    >
                        <Icon 
                            name="fire"
                            size={28}
                            color={index < streak ? colors.fireActive : colors.fireInactive}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
        marginBottom: 16,
    },
    streakContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    fireIconContainer: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: colors.white,
    },
    activeFireContainer: {
        backgroundColor: colors.fireActive + '15',
        transform: [{ scale: 1.1 }],
    }
});

export default WeeklyStreak; 