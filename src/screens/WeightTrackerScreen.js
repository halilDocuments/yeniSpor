import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    Alert,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { SPACING, FONT_SIZE } from '../constants/layout';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const WeightTrackerScreen = () => {
    const [weightData, setWeightData] = useState([
        { date: '2024-01-01', weight: 75 },
        { date: '2024-01-08', weight: 74.5 },
        { date: '2024-01-15', weight: 74 },
        { date: '2024-01-22', weight: 73.5 },
        { date: '2024-01-29', weight: 73 },
    ]);
    const [showModal, setShowModal] = useState(false);
    const [newWeight, setNewWeight] = useState('');
    const [targetWeight, setTargetWeight] = useState(70);
    const [startWeight, setStartWeight] = useState(75);

    const chartData = {
        labels: weightData.map(item => item.date.split('-')[2]),
        datasets: [{
            data: weightData.map(item => item.weight),
        }],
    };

    const addWeight = () => {
        if (!newWeight || isNaN(newWeight)) {
            Alert.alert('Hata', 'Lütfen geçerli bir kilo değeri girin');
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const newData = {
            date: today,
            weight: parseFloat(newWeight),
        };

        setWeightData([...weightData, newData]);
        setShowModal(false);
        setNewWeight('');
    };

    const calculateProgress = () => {
        const currentWeight = weightData[weightData.length - 1].weight;
        const totalChange = startWeight - targetWeight;
        const currentChange = startWeight - currentWeight;
        const progress = (currentChange / totalChange) * 100;
        return Math.min(Math.max(progress, 0), 100);
    };

    const getWeightChange = () => {
        const currentWeight = weightData[weightData.length - 1].weight;
        const change = startWeight - currentWeight;
        return change.toFixed(1);
    };

    const progress = calculateProgress();
    const weightChange = getWeightChange();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Kilo Takibi</Text>
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Başlangıç Kilosu</Text>
                        <Text style={styles.summaryValue}>{startWeight} kg</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Hedef Kilo</Text>
                        <Text style={styles.summaryValue}>{targetWeight} kg</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Mevcut Kilo</Text>
                        <Text style={styles.summaryValue}>{weightData[weightData.length - 1].weight} kg</Text>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressTitle}>İlerleme</Text>
                        <Text style={styles.progressPercentage}>{progress.toFixed(1)}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>
                        {weightChange > 0 ? 'Verilen' : 'Alınan'} Kilo: {Math.abs(weightChange)} kg
                    </Text>
                </View>

                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Kilo Değişimi</Text>
                    <LineChart
                        data={chartData}
                        width={screenWidth - 32}
                        height={220}
                        chartConfig={{
                            backgroundColor: colors.white,
                            backgroundGradientFrom: colors.white,
                            backgroundGradientTo: colors.white,
                            decimalPlaces: 1,
                            color: (opacity = 1) => colors.primary,
                            style: {
                                borderRadius: 16,
                            },
                        }}
                        bezier
                        style={styles.chart}
                    />
                </View>

                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>Kilo Geçmişi</Text>
                    {weightData.map((item, index) => (
                        <View key={index} style={styles.historyItem}>
                            <View style={styles.historyDate}>
                                <Icon name="calendar" size={20} color={colors.primary} />
                                <Text style={styles.historyDateText}>
                                    {new Date(item.date).toLocaleDateString('tr-TR')}
                                </Text>
                            </View>
                            <Text style={styles.historyWeight}>{item.weight} kg</Text>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowModal(true)}
            >
                <Icon name="plus" size={24} color={colors.white} />
                <Text style={styles.addButtonText}>Yeni Ölçüm Ekle</Text>
            </TouchableOpacity>

            <Modal
                visible={showModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Yeni Kilo Ölçümü</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Kilo (kg)</Text>
                            <TextInput
                                style={styles.input}
                                value={newWeight}
                                onChangeText={setNewWeight}
                                keyboardType="numeric"
                                placeholder="Kilonuzu girin"
                            />
                        </View>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowModal(false)}
                            >
                                <Text style={styles.modalButtonText}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={addWeight}
                            >
                                <Text style={[styles.modalButtonText, styles.saveButtonText]}>Kaydet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        padding: SPACING.md,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
        color: colors.text,
    },
    content: {
        flex: 1,
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: SPACING.md,
        backgroundColor: colors.white,
        margin: SPACING.sm,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryItem: {
        alignItems: 'center',
        backgroundColor: colors.primary + '10',
        padding: SPACING.sm,
        borderRadius: 8,
        minWidth: 100,
    },
    summaryLabel: {
        fontSize: FONT_SIZE.xs,
        color: colors.textLight,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.primary,
    },
    progressContainer: {
        backgroundColor: colors.white,
        margin: SPACING.sm,
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    progressTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
    },
    progressPercentage: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.primary,
    },
    progressBar: {
        height: 8,
        backgroundColor: colors.primary + '20',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: SPACING.sm,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: 4,
    },
    progressText: {
        fontSize: FONT_SIZE.sm,
        color: colors.textLight,
        textAlign: 'center',
    },
    chartContainer: {
        backgroundColor: colors.white,
        margin: SPACING.sm,
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    chartTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
        marginBottom: SPACING.sm,
    },
    chart: {
        marginVertical: SPACING.sm,
        borderRadius: 12,
    },
    historyContainer: {
        backgroundColor: colors.white,
        margin: SPACING.sm,
        padding: SPACING.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    historyTitle: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
        marginBottom: SPACING.sm,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    historyDate: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    historyDateText: {
        fontSize: FONT_SIZE.sm,
        color: colors.text,
        marginLeft: SPACING.xs,
    },
    historyWeight: {
        fontSize: FONT_SIZE.md,
        fontWeight: '500',
        color: colors.primary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        margin: SPACING.md,
        padding: SPACING.md,
        borderRadius: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    addButtonText: {
        color: colors.white,
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        marginLeft: SPACING.sm,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: SPACING.lg,
    },
    modalTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: '600',
        color: colors.text,
        marginBottom: SPACING.md,
    },
    inputContainer: {
        marginBottom: SPACING.lg,
    },
    inputLabel: {
        fontSize: FONT_SIZE.md,
        color: colors.text,
        marginBottom: SPACING.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        padding: SPACING.sm,
        fontSize: FONT_SIZE.md,
        color: colors.text,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: SPACING.xs,
    },
    cancelButton: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.border,
    },
    saveButton: {
        backgroundColor: colors.primary,
    },
    modalButtonText: {
        fontSize: FONT_SIZE.md,
        fontWeight: '600',
        color: colors.text,
    },
    saveButtonText: {
        color: colors.white,
    },
    ayarlarButonu: {
        padding: SPACING.xs,
    },
});

export default WeightTrackerScreen; 