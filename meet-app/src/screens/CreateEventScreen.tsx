import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SuccessModal from '../components/SuccessModal';

interface CreateEventScreenProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateEventScreen({
  visible,
  onClose,
}: CreateEventScreenProps) {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requireXLM, setRequireXLM] = useState(false);
  const [xlmAmount, setXlmAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCreateEvent = () => {
    if (!eventName.trim()) {
      return;
    }
    if (!startDate.trim()) {
      return;
    }

    // Show success modal with confetti
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Reset form
    setEventName('');
    setStartDate('');
    setEndDate('');
    setLocation('');
    setDescription('');
    setRequireXLM(false);
    setXlmAmount('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerEmoji}>✨</Text>
            </View>
            <Text style={styles.headerTitle}>Criar Evento</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#18181B" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* Event Image Placeholder */}
            <TouchableOpacity style={styles.imagePlaceholder} activeOpacity={0.8}>
              <View style={styles.imagePlaceholderContent}>
                <View style={styles.imageIcon}>
                  <Ionicons name="image" size={48} color="#18181B" />
                </View>
                <Text style={styles.imagePlaceholderText}>Adicionar Capa</Text>
                <Text style={styles.imagePlaceholderSubtext}>Clique para adicionar uma imagem</Text>
              </View>
            </TouchableOpacity>

            {/* Nome do Evento */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome do Evento ✨</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Stellar Hack+ Buenos Aires"
                placeholderTextColor="#71717A"
                value={eventName}
                onChangeText={setEventName}
              />
            </View>

            {/* Datas */}
            <View style={styles.dateRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Início 🕐</Text>
                <TextInput
                  style={styles.input}
                  placeholder="21 de nov., 13:00"
                  placeholderTextColor="#71717A"
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Fim 🕐</Text>
                <TextInput
                  style={styles.input}
                  placeholder="14:00"
                  placeholderTextColor="#71717A"
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>
            </View>

            {/* Localização */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Localização 📍</Text>
              <TouchableOpacity style={styles.locationInput} activeOpacity={0.8}>
                <Ionicons name="location" size={20} color="#71717A" />
                <TextInput
                  style={styles.locationInputText}
                  placeholder="Escolher Localização"
                  placeholderTextColor="#71717A"
                  value={location}
                  onChangeText={setLocation}
                />
                <Ionicons name="chevron-forward" size={20} color="#71717A" />
              </TouchableOpacity>
            </View>

            {/* Descrição */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Descrição 📝</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Adicionar Descrição"
                placeholderTextColor="#71717A"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Ingressos Section */}
            <View style={styles.ticketsSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Ingressos</Text>
                <Text style={styles.sectionEmoji}>🎫</Text>
              </View>

              <View style={styles.xlmRequirementCard}>
                <View style={styles.xlmRequirementHeader}>
                  <View style={styles.xlmRequirementLeft}>
                    <View style={styles.xlmIcon}>
                      <Text style={styles.xlmIconText}>$</Text>
                    </View>
                    <View>
                      <Text style={styles.xlmRequirementTitle}>Requer XLM Mínimo</Text>
                      <Text style={styles.xlmRequirementSubtitle}>
                        Participantes devem ter saldo
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={requireXLM}
                    onValueChange={setRequireXLM}
                    trackColor={{ false: '#E5E7EB', true: '#A78BFA' }}
                    thumbColor={requireXLM ? '#FFFFFF' : '#FFFFFF'}
                    ios_backgroundColor="#E5E7EB"
                  />
                </View>

                {requireXLM && (
                  <View style={styles.xlmAmountContainer}>
                    <Text style={styles.xlmAmountLabel}>Quantidade mínima</Text>
                    <View style={styles.xlmAmountInputContainer}>
                      <TextInput
                        style={styles.xlmAmountInput}
                        placeholder="0.00"
                        placeholderTextColor="#71717A"
                        keyboardType="decimal-pad"
                        value={xlmAmount}
                        onChangeText={setXlmAmount}
                      />
                      <View style={styles.xlmBadge}>
                        <Text style={styles.xlmBadgeText}>XLM</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              {/* Price Info */}
              <View style={styles.priceInfo}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Preço</Text>
                  <View style={styles.priceValue}>
                    <Text style={styles.priceValueText}>Grátis</Text>
                    <Ionicons name="chevron-forward" size={16} color="#71717A" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 120 }} />
        </ScrollView>

        {/* Create Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateEvent}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={24} color="#18181B" />
            <Text style={styles.createButtonText}>Criar Evento</Text>
          </TouchableOpacity>
        </View>

        {/* Success Modal with Confetti */}
        <SuccessModal
          visible={showSuccess}
          eventName={eventName}
          eventDate={startDate}
          onClose={handleCloseSuccess}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#18181B',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FBBF24',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    transform: [{ rotate: '-5deg' }],
  },
  headerEmoji: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    borderStyle: 'dashed',
    marginBottom: 24,
    overflow: 'hidden',
  },
  imagePlaceholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  imageIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
  },
  imagePlaceholderText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
  },
  imagePlaceholderSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#18181B',
    padding: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  textArea: {
    minHeight: 120,
    paddingTop: 16,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#18181B',
    padding: 16,
    gap: 12,
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  locationInputText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
  },
  ticketsSection: {
    marginTop: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -0.5,
  },
  sectionEmoji: {
    fontSize: 24,
    transform: [{ rotate: '12deg' }],
  },
  xlmRequirementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    padding: 20,
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 16,
  },
  xlmRequirementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  xlmRequirementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  xlmIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
  },
  xlmIconText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#18181B',
  },
  xlmRequirementTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181B',
  },
  xlmRequirementSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717A',
    marginTop: 2,
  },
  xlmAmountContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E5E7EB',
  },
  xlmAmountLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#52525B',
    marginBottom: 8,
  },
  xlmAmountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F1E8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#18181B',
    padding: 12,
  },
  xlmAmountInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#18181B',
  },
  xlmBadge: {
    backgroundColor: '#A78BFA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#18181B',
  },
  xlmBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#18181B',
  },
  priceInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#18181B',
    padding: 16,
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181B',
  },
  priceValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceValueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4ADE80',
  },
  footer: {
    padding: 20,
    paddingBottom: 24,
    borderTopWidth: 3,
    borderTopColor: '#18181B',
    backgroundColor: '#F5F1E8',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FBBF24',
    padding: 18,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: 0.5,
  },
});

