import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Ionicons } from '@expo/vector-icons';

interface RegisterSuccessModalProps {
  visible: boolean;
  eventName: string;
  onClose: () => void;
  hadZKProof?: boolean;
}

const { width } = Dimensions.get('window');

export default function RegisterSuccessModal({
  visible,
  eventName,
  onClose,
  hadZKProof = false,
}: RegisterSuccessModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      confettiRef.current?.start();

      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ConfettiCannon
          ref={confettiRef}
          count={150}
          origin={{ x: width / 2, y: 0 }}
          autoStart={false}
          fadeOut={true}
          explosionSpeed={300}
          fallSpeed={3000}
          colors={['#FBBF24', '#A78BFA', '#4ADE80', '#F472B6', '#60A5FA']}
        />

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={28} color="#18181B" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.checkCircle,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Ionicons name="checkmark-circle" size={120} color="#4ADE80" />
          </Animated.View>

          <View style={styles.textContainer}>
            <Text style={styles.successTitle}>Registrado! 🎉</Text>
            <View style={styles.eventNameCard}>
              <Text style={styles.eventName}>{eventName}</Text>
            </View>
          </View>

          {hadZKProof && (
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="shield-checkmark" size={24} color="#18181B" />
                </View>
                <Text style={styles.infoText}>
                  Prova ZK verificada com sucesso
                </Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={styles.viewButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.viewButtonText}>Ver Evento</Text>
            <Ionicons name="arrow-forward" size={24} color="#18181B" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
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
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  checkCircle: {
    marginBottom: 32,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  successTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 20,
    letterSpacing: -1,
    textAlign: 'center',
  },
  eventNameCard: {
    backgroundColor: '#4ADE80',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    transform: [{ rotate: '-2deg' }],
  },
  eventName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#18181B',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 32,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#A78BFA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181B',
    flex: 1,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    width: '100%',
  },
  viewButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: 0.3,
  },
});

