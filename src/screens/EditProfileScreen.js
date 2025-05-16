import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE } from '../constants/layout';

const EditProfileScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        name: 'Halil Harman',
        email: 'halil@example.com',
        age: '28',
        height: '180',
        weight: '75',
        goals: ['Kas Kazanımı', 'Güç Artışı'],
    });

    const [newGoal, setNewGoal] = useState('');

    const handleSave = () => {
        // Burada form verilerini kaydetme işlemi yapılacak
        Alert.alert(
            'Başarılı',
            'Profil bilgileriniz güncellendi.',
            [{ text: 'Tamam', onPress: () => navigation.goBack() }]
        );
    };

    const addGoal = () => {
        if (newGoal.trim()) {
            setFormData(prev => ({
                ...prev,
                goals: [...prev.goals, newGoal.trim()]
            }));
            setNewGoal('');
        }
    };

    const removeGoal = (index) => {
        setFormData(prev => ({
            ...prev,
            goals: prev.goals.filter((_, i) => i !== index)
        }));
    };

    const Header = () => (
        <View style={styles.header}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profili Düzenle</Text>
            <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSave}
            >
                <Text style={styles.saveButtonText}>Kaydet</Text>
            </TouchableOpacity>
        </View>
    );

    const PersonalInfoSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Ad Soyad</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                        placeholder="Adınız ve soyadınız"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>E-posta</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.email}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                        placeholder="E-posta adresiniz"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
            </View>
        </View>
    );

    const PhysicalInfoSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fiziksel Bilgiler</Text>
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Yaş</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.age}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
                        placeholder="Yaşınız"
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Boy (cm)</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.height}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, height: text }))}
                        placeholder="Boyunuz"
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>Kilo (kg)</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.weight}
                        onChangeText={(text) => setFormData(prev => ({ ...prev, weight: text }))}
                        placeholder="Kilonuz"
                        keyboardType="numeric"
                    />
                </View>
            </View>
        </View>
    );

    const GoalsSection = () => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hedefler</Text>
            <View style={styles.goalsContainer}>
                {formData.goals.map((goal, index) => (
                    <View key={index} style={styles.goalItem}>
                        <Text style={styles.goalText}>{goal}</Text>
                        <TouchableOpacity 
                            onPress={() => removeGoal(index)}
                            style={styles.removeGoalButton}
                        >
                            <Icon name="close" size={20} color={colors.error} />
                        </TouchableOpacity>
                    </View>
                ))}
                <View style={styles.addGoalContainer}>
                    <TextInput
                        style={styles.addGoalInput}
                        value={newGoal}
                        onChangeText={setNewGoal}
                        placeholder="Yeni hedef ekle"
                        onSubmitEditing={addGoal}
                    />
                    <TouchableOpacity 
                        style={styles.addGoalButton}
                        onPress={addGoal}
                    >
                        <Icon name="plus" size={24} color={colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                <Header />
                <PersonalInfoSection />
                <PhysicalInfoSection />
                <GoalsSection />
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
    scrollView: {
        flex: 1,
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
    section: {
        padding: SPACING.md,
        backgroundColor: colors.white,
        marginHorizontal: SPACING.md,
        marginTop: SPACING.md,
        borderRadius: 16,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
        marginBottom: SPACING.md,
    },
    inputContainer: {
        gap: SPACING.md,
    },
    inputWrapper: {
        gap: SPACING.xs,
    },
    label: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: colors.text,
    },
    goalsContainer: {
        gap: SPACING.sm,
    },
    goalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.primary + '15',
        padding: SPACING.sm,
        borderRadius: 12,
    },
    goalText: {
        fontSize: FONT_SIZE.md,
        color: colors.text,
    },
    removeGoalButton: {
        padding: SPACING.xs,
    },
    addGoalContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginTop: SPACING.sm,
    },
    addGoalInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        padding: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: colors.text,
    },
    addGoalButton: {
        backgroundColor: colors.primary,
        padding: SPACING.sm,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditProfileScreen; 