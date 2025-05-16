import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE } from '../constants/layout';
import * as Progress from 'react-native-progress';

const DailyGoalsScreen = ({ route, navigation }) => {
    const [goals, setGoals] = useState({
        calories: {
            current: 1200,
            target: 2000,
            unit: 'kcal',
            icon: 'fire',
            color: '#FF6B6B',
        },
        water: {
            current: 1.5,
            target: 2.5,
            unit: 'L',
            icon: 'water',
            color: '#4ECDC4',
        },
        steps: {
            current: 6500,
            target: 10000,
            unit: 'adım',
            icon: 'walk',
            color: '#45B7D1',
        },
        protein: {
            current: 75,
            target: 120,
            unit: 'g',
            icon: 'food-steak',
            color: '#96CEB4',
        },
        sleep: {
            current: 6.5,
            target: 8,
            unit: 'saat',
            icon: 'sleep',
            color: '#7A6FF0',
        },
        workout: {
            current: 45,
            target: 60,
            unit: 'dk',
            icon: 'dumbbell',
            color: '#FF9F43',
        },
    });

    const Header = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Günlük Hedefler</Text>
            <TouchableOpacity 
                style={styles.editButton}
                onPress={() => navigation.navigate('EditGoals')}
            >
                <Icon name="pencil" size={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );

    const renderGoalCard = useCallback(([key, goal]) => {
        const progress = goal.current / goal.target;
        return (
            <View key={key} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: goal.color + '15' }]}>
                        <Icon name={goal.icon} size={24} color={goal.color} />
                    </View>
                    <View style={styles.goalInfo}>
                        <Text style={styles.goalTitle}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Text>
                        <Text style={styles.goalValue}>
                            {goal.current} / {goal.target} {goal.unit}
                        </Text>
                    </View>
                    <Text style={[styles.goalPercentage, { color: goal.color }]}>
                        {Math.round(progress * 100)}%
                    </Text>
                </View>
                <Progress.Bar
                    progress={progress}
                    width={null}
                    height={8}
                    color={goal.color}
                    unfilledColor={goal.color + '15'}
                    borderWidth={0}
                    borderRadius={4}
                    style={styles.progressBar}
                />
            </View>
        );
    }, []);

    const renderSummary = () => (
        <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Günlük Özet</Text>
            <View style={styles.summaryContent}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>4/6</Text>
                    <Text style={styles.summaryLabel}>Hedef Tamamlandı</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>67%</Text>
                    <Text style={styles.summaryLabel}>Ortalama İlerleme</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
            {Header()}
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {renderSummary()}
                <View style={styles.goalsContainer}>
                    {Object.entries(goals).map(renderGoalCard)}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
        color: colors.text,
    },
    backButton: {
        padding: SPACING.xs,
    },
    editButton: {
        padding: SPACING.xs,
    },
    scrollView: {
        flex: 1,
    },
    summaryCard: {
        backgroundColor: colors.white,
        margin: SPACING.md,
        padding: SPACING.md,
        borderRadius: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    summaryTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
        marginBottom: SPACING.md,
    },
    summaryContent: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    summaryItem: {
        alignItems: 'center',
    },
    summaryValue: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '600',
        color: colors.primary,
    },
    summaryLabel: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        marginTop: SPACING.xs,
    },
    summaryDivider: {
        width: 1,
        height: '80%',
        backgroundColor: colors.border,
    },
    goalsContainer: {
        padding: SPACING.md,
    },
    goalCard: {
        backgroundColor: colors.white,
        padding: SPACING.md,
        borderRadius: 16,
        marginBottom: SPACING.md,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    goalInfo: {
        flex: 1,
    },
    goalTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
    },
    goalValue: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        marginTop: 2,
    },
    goalPercentage: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
    },
    progressBar: {
        marginTop: SPACING.xs,
    },
});

export default DailyGoalsScreen; 