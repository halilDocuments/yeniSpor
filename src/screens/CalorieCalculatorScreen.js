import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Dimensions,
    StatusBar,
} from 'react-native';
import { colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SPACING, FONT_SIZE } from '../constants/layout';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CalorieCalculatorScreen = ({ navigation }) => {
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [gender, setGender] = useState('male');
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [goal, setGoal] = useState('weightLoss');

    const activityLevels = [
        { id: 'sedentary', label: 'Hareketsiz', description: 'Masa başı iş, az hareket', multiplier: 1.2, icon: 'seat-outline' },
        { id: 'light', label: 'Az Hareketli', description: 'Hafif yürüyüş, ev işleri', multiplier: 1.375, icon: 'walk' },
        { id: 'moderate', label: 'Orta Aktif', description: 'Haftada 3-5 gün egzersiz', multiplier: 1.55, icon: 'run' },
        { id: 'active', label: 'Çok Aktif', description: 'Haftada 6-7 gün egzersiz', multiplier: 1.725, icon: 'bike' },
        { id: 'veryActive', label: 'Profesyonel', description: 'Sporcu/Ağır iş', multiplier: 1.9, icon: 'weight-lifter' },
    ];

    const goals = [
        { id: 'weightLoss', label: 'Kilo Verme', calories: -500 },
        { id: 'maintenance', label: 'Kilo Koruma', calories: 0 },
        { id: 'weightGain', label: 'Kilo Alma', calories: 500 },
    ];

    const handleNumericInput = useCallback((text, setter) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setter(numericValue);
    }, []);

    const validateInputs = useCallback(() => {
        if (!age || !height || !weight) {
            Alert.alert('Hata', 'Lütfen tüm alanları doldurun');
            return false;
        }

        const ageNum = parseFloat(age);
        const heightNum = parseFloat(height);
        const weightNum = parseFloat(weight);

        if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) {
            Alert.alert('Hata', 'Lütfen geçerli sayısal değerler girin');
            return false;
        }

        if (ageNum < 1 || ageNum > 120) {
            Alert.alert('Hata', 'Lütfen geçerli bir yaş girin (1-120)');
            return false;
        }
        if (heightNum < 50 || heightNum > 250) {
            Alert.alert('Hata', 'Lütfen geçerli bir boy girin (50-250 cm)');
            return false;
        }
        if (weightNum < 20 || weightNum > 300) {
            Alert.alert('Hata', 'Lütfen geçerli bir kilo girin (20-300 kg)');
            return false;
        }

        return { ageNum, heightNum, weightNum };
    }, [age, height, weight]);

    const calculateBMR = useCallback((ageNum, heightNum, weightNum, selectedGender) => {
        if (selectedGender === 'male') {
            return 88.362 + (13.397 * weightNum) + (4.799 * heightNum) - (5.677 * ageNum);
        }
        return 447.593 + (9.247 * weightNum) + (3.098 * heightNum) - (4.330 * ageNum);
    }, []);

    const calculateMacros = useCallback((calories) => {
        return {
            protein: Math.round(calories * 0.3 / 4),
            carbs: Math.round(calories * 0.4 / 4),
            fat: Math.round(calories * 0.3 / 9),
        };
    }, []);

    const calculateCalories = useCallback(() => {
        const validatedInputs = validateInputs();
        if (!validatedInputs) return;

        const { ageNum, heightNum, weightNum } = validatedInputs;
        const bmr = calculateBMR(ageNum, heightNum, weightNum, gender);
        
        const activityMultiplier = activityLevels.find(a => a.id === activityLevel).multiplier;
        const goalCalories = goals.find(g => g.id === goal).calories;
        
        const dailyCalories = Math.round((bmr * activityMultiplier) + goalCalories);
        const macros = calculateMacros(dailyCalories);

        Alert.alert(
            'Günlük Kalori İhtiyacınız',
            `Günlük kalori ihtiyacınız: ${dailyCalories} kcal\n\n` +
            `Protein: ${macros.protein}g\n` +
            `Karbonhidrat: ${macros.carbs}g\n` +
            `Yağ: ${macros.fat}g`
        );
    }, [validateInputs, calculateBMR, calculateMacros, gender, activityLevel, goal, activityLevels, goals]);

    const ActivityButton = useCallback(({ level, label, description, icon }) => (
        <TouchableOpacity
            style={[
                styles.activityButton,
                activityLevel === level && styles.activityButtonActive
            ]}
            onPress={() => setActivityLevel(level)}
        >
            <View style={styles.activityIconContainer}>
                <Icon 
                    name={icon} 
                    size={28} 
                    color={activityLevel === level ? colors.white : colors.primary} 
                />
            </View>
            <View style={styles.activityTextContainer}>
                <Text style={[
                    styles.activityButtonLabel,
                    activityLevel === level && styles.activityButtonTextActive
                ]}>
                    {label}
                </Text>
                <Text style={[
                    styles.activityButtonDescription,
                    activityLevel === level && styles.activityButtonTextActive
                ]}>
                    {description}
                </Text>
            </View>
            <View style={[
                styles.activityCheckmark,
                activityLevel === level && styles.activityCheckmarkActive
            ]}>
                <Icon 
                    name="check" 
                    size={16} 
                    color={activityLevel === level ? colors.white : 'transparent'} 
                />
            </View>
        </TouchableOpacity>
    ), [activityLevel]);

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Kalori Hesaplayıcı</Text>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollViewContent}
            >
                <View style={styles.formContainer}>
                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
                        <View style={styles.genderContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.genderButton,
                                    gender === 'male' && styles.genderButtonActive
                                ]}
                                onPress={() => setGender('male')}
                            >
                                <Icon 
                                    name="gender-male" 
                                    size={28} 
                                    color={gender === 'male' ? colors.white : colors.primary} 
                                />
                                <Text style={[
                                    styles.genderButtonText,
                                    gender === 'male' && styles.genderButtonTextActive
                                ]}>Erkek</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.genderButton,
                                    gender === 'female' && styles.genderButtonActive
                                ]}
                                onPress={() => setGender('female')}
                            >
                                <Icon 
                                    name="gender-female" 
                                    size={28} 
                                    color={gender === 'female' ? colors.white : colors.primary} 
                                />
                                <Text style={[
                                    styles.genderButtonText,
                                    gender === 'female' && styles.genderButtonTextActive
                                ]}>Kadın</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.label}>Yaş</Text>
                                <TextInput
                                    style={styles.input}
                                    value={age}
                                    onChangeText={(text) => handleNumericInput(text, setAge)}
                                    keyboardType="numeric"
                                    placeholder="Yaş"
                                    maxLength={3}
                                    returnKeyType="next"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                                <Text style={styles.label}>Boy (cm)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={height}
                                    onChangeText={(text) => handleNumericInput(text, setHeight)}
                                    keyboardType="numeric"
                                    placeholder="Boy"
                                    maxLength={3}
                                    returnKeyType="next"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                                <Text style={styles.label}>Kilo (kg)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={weight}
                                    onChangeText={(text) => handleNumericInput(text, setWeight)}
                                    keyboardType="numeric"
                                    placeholder="Kilo"
                                    maxLength={3}
                                    returnKeyType="next"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Aktivite Seviyesi</Text>
                        <View style={styles.activityButtons}>
                            {activityLevels.map((activity) => (
                                <ActivityButton 
                                    key={activity.id} 
                                    level={activity.id} 
                                    label={activity.label} 
                                    description={activity.description}
                                    icon={activity.icon} 
                                />
                            ))}
                        </View>
                    </View>

                    <View style={styles.formSection}>
                        <Text style={styles.sectionTitle}>Hedef</Text>
                        <View style={styles.goalContainer}>
                            {goals.map((goalOption) => (
                                <TouchableOpacity
                                    key={goalOption.id}
                                    style={[
                                        styles.goalButton,
                                        goal === goalOption.id && styles.goalButtonActive
                                    ]}
                                    onPress={() => setGoal(goalOption.id)}
                                >
                                    <Icon 
                                        name={
                                            goalOption.id === 'weightLoss' ? 'trending-down' :
                                            goalOption.id === 'maintenance' ? 'trending-neutral' :
                                            'trending-up'
                                        } 
                                        size={24} 
                                        color={goal === goalOption.id ? colors.white : colors.primary} 
                                    />
                                    <Text style={[
                                        styles.goalButtonText,
                                        goal === goalOption.id && styles.goalButtonTextActive
                                    ]}>{goalOption.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity 
                        style={styles.calculateButton}
                        onPress={calculateCalories}
                    >
                        <Text style={styles.calculateButtonText}>Hesapla</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: colors.text,
        marginLeft: 16,
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    formContainer: {
        padding: 16,
    },
    formSection: {
        marginBottom: 24,
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.textLight,
        marginBottom: 8,
    },
    input: {
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    genderContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        gap: 12,
    },
    genderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.primary,
        gap: 12,
    },
    genderButtonActive: {
        backgroundColor: colors.primary,
    },
    genderButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primary,
    },
    genderButtonTextActive: {
        color: colors.white,
    },
    activityButtons: {
        gap: 12,
    },
    activityButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
    },
    activityButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    activityIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityTextContainer: {
        flex: 1,
        marginLeft: 16,
    },
    activityButtonLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 4,
    },
    activityButtonDescription: {
        fontSize: 14,
        color: colors.textLight,
    },
    activityButtonTextActive: {
        color: colors.white,
    },
    activityCheckmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    activityCheckmarkActive: {
        backgroundColor: colors.primary,
        borderColor: colors.white,
    },
    goalContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    goalButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.primary,
        gap: 8,
    },
    goalButtonActive: {
        backgroundColor: colors.primary,
    },
    goalButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.primary,
        textAlign: 'center',
    },
    goalButtonTextActive: {
        color: colors.white,
    },
    calculateButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    calculateButtonText: {
        color: colors.white,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default CalorieCalculatorScreen; 