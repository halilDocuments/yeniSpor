import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    Platform,
    Alert,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE } from '../constants/layout';
import Slider from '@react-native-community/slider';

const EditGoalsScreen = ({ navigation }) => {
    const [goals, setGoals] = useState({
        nutrition: {
            calories: {
                target: '2500',
                current: '1800',
                unit: 'kcal',
                icon: 'fire',
                color: '#F5A623',
                description: 'Günlük kalori hedefiniz',
                min: '1200',
                max: '4000',
                title: 'Kalori',
            },
            protein: {
                target: '150',
                current: '95',
                unit: 'g',
                icon: 'food-steak',
                color: '#9013FE',
                description: 'Günlük protein hedefiniz',
                min: '50',
                max: '300',
                title: 'Protein',
            },
            water: {
                target: '2.5',
                current: '1.2',
                unit: 'L',
                icon: 'water',
                color: '#4A90E2',
                description: 'Günlük su tüketimi hedefiniz',
                min: '1',
                max: '5',
                title: 'Su',
            },
        },
        activity: {
            steps: {
                target: '10000',
                current: '6500',
                unit: 'adım',
                icon: 'walk',
                color: '#7ED321',
                description: 'Günlük adım hedefiniz',
                min: '1000',
                max: '20000',
                title: 'Adım',
            },
            workout: {
                target: '60',
                current: '45',
                unit: 'dk',
                icon: 'dumbbell',
                color: '#FF6B6B',
                description: 'Günlük antrenman süresi',
                min: '15',
                max: '180',
                title: 'Antrenman',
            },
        },
        health: {
            sleep: {
                target: '8',
                current: '6.5',
                unit: 'saat',
                icon: 'sleep',
                color: '#9B51E0',
                description: 'Günlük uyku hedefiniz',
                min: '4',
                max: '12',
                title: 'Uyku',
            },
        },
    });

    const [activeCategory, setActiveCategory] = useState('nutrition');
    const [expandedGoal, setExpandedGoal] = useState(null);

    const handleSave = useCallback(() => {
        Alert.alert(
            'Başarılı',
            'Günlük hedefleriniz güncellendi.',
            [{ text: 'Tamam', onPress: () => navigation.goBack() }]
        );
    }, [navigation]);

    const updateGoal = useCallback((category, key, field, value) => {
        if (!value) return;

        setGoals(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: {
                    ...prev[category][key],
                    [field]: value
                }
            }
        }));
    }, []);

    const Header = useMemo(() => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Günlük Hedefler</Text>
            <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
            >
                <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
        </View>
    ), [navigation, handleSave]);

    const CategorySelector = useMemo(() => (
        <View style={styles.categoryContainer}>
            {Object.keys(goals).map((category) => (
                <TouchableOpacity
                    key={category}
                    style={[
                        styles.categoryButton,
                        activeCategory === category && styles.activeCategory
                    ]}
                    onPress={() => setActiveCategory(category)}
                >
                    <Icon 
                        name={
                            category === 'nutrition' ? 'food-apple' :
                            category === 'activity' ? 'run' : 'heart-pulse'
                        } 
                        size={20} 
                        color={activeCategory === category ? colors.primary : colors.textLight} 
                    />
                    <Text style={[
                        styles.categoryText,
                        activeCategory === category && styles.activeCategoryText
                    ]}>
                        {category === 'nutrition' ? 'Beslenme' :
                         category === 'activity' ? 'Aktivite' : 'Sağlık'}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    ), [activeCategory, goals]);

    const GoalCard = useCallback(({ category, goalKey, data }) => {
        const isExpanded = expandedGoal === `${category}-${goalKey}`;
        const progress = parseFloat(data.current) / parseFloat(data.target);

        const handleSliderChange = useCallback((value) => {
            const roundedValue = Math.round(value * 10) / 10; // 1 ondalık basamağa yuvarla
            updateGoal(category, goalKey, 'current', roundedValue.toString());
        }, [category, goalKey, updateGoal]);

        const handleInputChange = useCallback((value, field) => {
            const numValue = parseFloat(value);
            if (isNaN(numValue)) return;

            const min = parseFloat(data.min);
            const max = parseFloat(data.max);
            const clampedValue = Math.min(Math.max(numValue, min), max);
            
            updateGoal(category, goalKey, field, clampedValue.toString());
        }, [category, goalKey, data.min, data.max, updateGoal]);

        return (
            <TouchableOpacity 
                style={[
                    styles.goalCard,
                    isExpanded && styles.expandedCard
                ]}
                onPress={() => setExpandedGoal(isExpanded ? null : `${category}-${goalKey}`)}
            >
                <View style={styles.goalHeader}>
                    <View style={[styles.iconContainer, { backgroundColor: data.color + '15' }]}>
                        <Icon name={data.icon} size={24} color={data.color} />
                    </View>
                    <View style={styles.goalInfo}>
                        <Text style={styles.goalTitle}>{data.title}</Text>
                        <Text style={styles.goalDescription}>{data.description}</Text>
                    </View>
                    <Icon 
                        name={isExpanded ? 'chevron-up' : 'chevron-down'} 
                        size={24} 
                        color={colors.textLight} 
                    />
                </View>

                {isExpanded && (
                    <View style={styles.goalContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Hedef</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={data.target}
                                    onChangeText={(value) => handleInputChange(value, 'target')}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor={colors.textLight}
                                    returnKeyType="done"
                                    blurOnSubmit={true}
                                    maxLength={10}
                                />
                                <Text style={styles.unit}>{data.unit}</Text>
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Mevcut</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    value={data.current}
                                    onChangeText={(value) => handleInputChange(value, 'current')}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor={colors.textLight}
                                    returnKeyType="done"
                                    blurOnSubmit={true}
                                    maxLength={10}
                                />
                                <Text style={styles.unit}>{data.unit}</Text>
                            </View>
                        </View>
                        <View style={styles.sliderContainer}>
                            <View style={styles.sliderLabels}>
                                <Text style={styles.sliderLabel}>{data.min}</Text>
                                <Text style={styles.sliderLabel}>{data.max}</Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={parseFloat(data.min)}
                                maximumValue={parseFloat(data.max)}
                                value={parseFloat(data.current)}
                                onValueChange={handleSliderChange}
                                minimumTrackTintColor={data.color}
                                maximumTrackTintColor={colors.border}
                                thumbTintColor={data.color}
                                step={0.1}
                            />
                        </View>
                    </View>
                )}

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View 
                            style={[
                                styles.progressFill,
                                { 
                                    width: `${Math.min(100, Math.max(0, progress * 100))}%`,
                                    backgroundColor: data.color
                                }
                            ]} 
                        />
                    </View>
                    <Text style={styles.progressText}>
                        {Math.round(Math.min(100, Math.max(0, progress * 100)))}%
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }, [expandedGoal, updateGoal]);

    const renderGoals = useMemo(() => (
        Object.entries(goals[activeCategory]).map(([goalKey, data]) => (
            <GoalCard 
                key={goalKey}
                category={activeCategory}
                goalKey={goalKey}
                data={data}
            />
        ))
    ), [goals, activeCategory, GoalCard]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                >
                    <ScrollView 
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        {Header}
                        {CategorySelector}
                        <View style={styles.content}>
                            {renderGoals}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    saveButton: {
        padding: SPACING.xs,
    },
    saveButtonText: {
        fontSize: FONT_SIZE.md,
        color: colors.primary,
        fontWeight: '600',
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: SPACING.md,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    categoryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
        borderRadius: 20,
        gap: SPACING.xs,
    },
    activeCategory: {
        backgroundColor: colors.primary + '15',
    },
    categoryText: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        fontWeight: '500',
    },
    activeCategoryText: {
        color: colors.primary,
    },
    content: {
        padding: SPACING.md,
        flex: 1,
    },
    goalCard: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    expandedCard: {
        borderWidth: 1,
        borderColor: colors.primary + '30',
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    goalInfo: {
        flex: 1,
    },
    goalTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
    },
    goalDescription: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        marginTop: 2,
    },
    goalContent: {
        marginTop: SPACING.md,
        paddingTop: SPACING.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    inputLabel: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        marginBottom: SPACING.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: SPACING.sm,
    },
    input: {
        flex: 1,
        fontSize: FONT_SIZE.md,
        color: colors.text,
        paddingVertical: SPACING.xs,
    },
    unit: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        marginLeft: SPACING.xs,
    },
    sliderContainer: {
        marginTop: SPACING.md,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    sliderLabel: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.md,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: colors.border,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        minWidth: 45,
    },
});

export default EditGoalsScreen; 