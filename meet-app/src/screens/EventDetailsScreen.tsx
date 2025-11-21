import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EventDetailsScreenProps {
  visible: boolean;
  onClose: () => void;
  event: {
    title: string;
    organizer: string;
    organizerIcon: string;
    time: string;
    location: string;
    image: any;
    status: 'LIVE' | 'UPCOMING';
    statusTime?: string;
    description?: string;
  };
  isMinted?: boolean;
  mintInfo?: {
    collector: string;
    walletAddress: string;
    mintedDate: string;
    blockchain: string;
  };
}

const MINT_OPTIONS = [
  { id: 'location', label: 'Location', icon: 'location' as const },
  { id: 'nfc', label: 'NFC', icon: 'wifi' as const },
  { id: 'secret', label: 'Secret Word', icon: 'key' as const },
  { id: 'qrcode', label: 'Scan QRCode', icon: 'qr-code' as const },
  { id: 'code', label: 'Enter Code', icon: 'keypad' as const },
];

export default function EventDetailsScreen({
  visible,
  onClose,
  event,
  isMinted = false,
  mintInfo,
}: EventDetailsScreenProps) {
  const [showMintOptions, setShowMintOptions] = useState(false);

  const handleMintOption = (option: string) => {
    setShowMintOptions(false);
    Alert.alert('Mint', `Você selecionou: ${option}`);
  };

  const handleMintPress = () => {
    if (isMinted) {
      Alert.alert('Já Coletado', 'Você já mintou este POAP! ✨');
    } else {
      setShowMintOptions(true);
    }
  };

  const handleContact = () => {
    Alert.alert('Contato', 'Abrir informações de contato');
  };

  const handleShare = () => {
    Alert.alert('Compartilhar', 'Compartilhar evento');
  };

  const handleMore = () => {
    Alert.alert('Mais', 'Mais opções');
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
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#18181B" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Event Image */}
          <View style={styles.imageContainer}>
            <Image source={event.image} style={styles.eventImage} />
            <View
              style={[
                styles.statusBadge,
                event.status === 'LIVE' && styles.statusBadgeLive,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  event.status === 'LIVE' && styles.statusTextLive,
                ]}
              >
                {event.status === 'LIVE' ? 'LIVE' : event.statusTime}
              </Text>
            </View>
          </View>

          {/* Event Info */}
          <View style={styles.content}>
            {/* Minted Info Card */}
            {isMinted && mintInfo && (
              <View style={styles.mintedCard}>
                <View style={styles.mintedHeader}>
                  <Text style={styles.mintedEmoji}>💎</Text>
                  <Text style={styles.mintedTitle}>Collected by</Text>
                </View>
                <Text style={styles.collectorName}>{mintInfo.collector}</Text>
                <Text style={styles.walletAddress}>{mintInfo.walletAddress}</Text>
                
                <View style={styles.mintedDivider} />
                
                <View style={styles.mintedDetailsRow}>
                  <Text style={styles.mintedEmoji}>🕐</Text>
                  <Text style={styles.mintedDetailsText}>Minted {mintInfo.mintedDate} on</Text>
                  <View style={styles.blockchainBadge}>
                    <View style={styles.blockchainDot} />
                    <Text style={styles.blockchainText}>{mintInfo.blockchain}</Text>
                  </View>
                </View>
                <Text style={styles.mintedTimestamp}>
                  {new Date().toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })} {new Date().toLocaleTimeString()}
                </Text>
              </View>
            )}

            {/* Organizer */}
            <View style={styles.organizerBadge}>
              <Text style={styles.organizerIcon}>{event.organizerIcon}</Text>
              <Text style={styles.organizer}>{event.organizer}</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>{event.title}</Text>

            {/* Details */}
            <View style={styles.details}>
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="time" size={20} color="#18181B" />
                </View>
                <Text style={styles.detailText}>{event.time}</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="location" size={20} color="#18181B" />
                </View>
                <Text style={styles.detailText}>{event.location}</Text>
              </View>
            </View>

            {/* Description */}
            {event.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Sobre o Evento ✨</Text>
                <Text style={styles.description}>{event.description}</Text>
              </View>
            )}

            {/* Status Badge */}
            <View style={styles.attendingBadge}>
              <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
              <Text style={styles.attendingText}>Você Vai</Text>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {/* Mint Button */}
          <TouchableOpacity
            style={[
              styles.actionButton, 
              styles.mintButton,
              isMinted && styles.mintButtonDisabled
            ]}
            onPress={handleMintPress}
            activeOpacity={isMinted ? 1 : 0.8}
            disabled={isMinted}
          >
            <Ionicons 
              name={isMinted ? "checkmark-circle" : "cube"} 
              size={24} 
              color={isMinted ? "#4ADE80" : "#18181B"} 
            />
            <Text style={[
              styles.actionButtonText,
              isMinted && styles.actionButtonTextDisabled
            ]}>
              {isMinted ? "Já Coletado ✨" : "Mint"}
            </Text>
          </TouchableOpacity>

          {/* Other Actions */}
          <View style={styles.secondaryActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleContact}
              activeOpacity={0.8}
            >
              <Ionicons name="mail" size={20} color="#18181B" />
              <Text style={styles.secondaryButtonText}>Contato</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleShare}
              activeOpacity={0.8}
            >
              <Ionicons name="share-social" size={20} color="#18181B" />
              <Text style={styles.secondaryButtonText}>Compartilhar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleMore}
              activeOpacity={0.8}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color="#18181B" />
              <Text style={styles.secondaryButtonText}>Mais</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mint Options Modal */}
        <Modal
          visible={showMintOptions}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowMintOptions(false)}
        >
          <View style={styles.mintModalOverlay}>
            <View style={styles.mintModalContent}>
              <View style={styles.mintModalHeader}>
                <Text style={styles.mintModalTitle}>Escolha o Método 🎯</Text>
                <TouchableOpacity
                  onPress={() => setShowMintOptions(false)}
                  style={styles.mintCloseButton}
                >
                  <Ionicons name="close" size={24} color="#18181B" />
                </TouchableOpacity>
              </View>

              <View style={styles.mintOptionsGrid}>
                {MINT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.mintOptionCard}
                    onPress={() => handleMintOption(option.label)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.mintOptionIcon}>
                      <Ionicons name={option.icon} size={32} color="#18181B" />
                    </View>
                    <Text style={styles.mintOptionLabel}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
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
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: '#18181B',
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
  imageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E5E7EB',
    borderBottomWidth: 3,
    borderBottomColor: '#18181B',
  },
  statusBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    transform: [{ rotate: '3deg' }],
  },
  statusBadgeLive: {
    backgroundColor: '#EF4444',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#18181B',
  },
  statusTextLive: {
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  mintedCard: {
    backgroundColor: '#E9D5FF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 20,
    transform: [{ rotate: '-1deg' }],
  },
  mintedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  mintedEmoji: {
    fontSize: 20,
  },
  mintedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#52525B',
  },
  collectorName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  walletAddress: {
    fontSize: 12,
    fontWeight: '600',
    color: '#71717A',
    fontFamily: 'monospace',
    marginBottom: 16,
  },
  mintedDivider: {
    height: 2,
    backgroundColor: '#18181B',
    marginVertical: 16,
  },
  mintedDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  mintedDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#52525B',
  },
  blockchainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#18181B',
  },
  blockchainDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#A78BFA',
  },
  blockchainText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#18181B',
  },
  mintedTimestamp: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181B',
    marginTop: 4,
  },
  organizerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F5F1E8',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#18181B',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  organizerIcon: {
    fontSize: 18,
  },
  organizer: {
    fontSize: 14,
    color: '#18181B',
    fontWeight: '700',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 24,
    lineHeight: 42,
    letterSpacing: -1,
  },
  details: {
    gap: 12,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
  },
  detailText: {
    fontSize: 16,
    color: '#18181B',
    fontWeight: '600',
    flex: 1,
  },
  descriptionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 24,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#52525B',
    lineHeight: 24,
    fontWeight: '500',
  },
  attendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#DCFCE7',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  attendingText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
  },
  actionsContainer: {
    padding: 20,
    paddingBottom: 24,
    borderTopWidth: 3,
    borderTopColor: '#18181B',
    backgroundColor: '#F5F1E8',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  mintButton: {
    backgroundColor: '#FBBF24',
  },
  mintButtonDisabled: {
    backgroundColor: '#E5E7EB',
    opacity: 0.7,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: 0.5,
  },
  actionButtonTextDisabled: {
    color: '#52525B',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  secondaryButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#18181B',
  },
  mintModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  mintModalContent: {
    backgroundColor: '#F5F1E8',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 3,
    borderColor: '#18181B',
    paddingBottom: 40,
  },
  mintModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 3,
    borderBottomColor: '#18181B',
  },
  mintModalTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: -0.5,
  },
  mintCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
  },
  mintOptionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  mintOptionCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  mintOptionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
  },
  mintOptionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#18181B',
    textAlign: 'center',
  },
});

