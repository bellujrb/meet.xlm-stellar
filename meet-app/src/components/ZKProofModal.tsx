import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ZKProofModalProps {
  visible: boolean;
  xlmRequired: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ZKProofModal({
  visible,
  xlmRequired,
  onClose,
  onSuccess,
}: ZKProofModalProps) {
  const [stage, setStage] = useState<'intro' | 'generating' | 'success'>('intro');
  const [progress, setProgress] = useState(0);

  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      setStage('intro');
      setProgress(0);
    }
  }, [visible]);

  useEffect(() => {
    if (stage === 'generating') {
      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate proof generation
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStage('success');
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 50,
              friction: 7,
              useNativeDriver: true,
            }).start();
            return 100;
          }
          return prev + 2;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleStartProof = () => {
    setStage('generating');
  };

  const handleComplete = () => {
    onSuccess();
    setTimeout(() => {
      onClose();
      setStage('intro');
      setProgress(0);
      rotateAnim.setValue(0);
      scaleAnim.setValue(0);
      pulseAnim.setValue(1);
    }, 300);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Close Button */}
        {stage === 'intro' && (
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={28} color="#18181B" />
          </TouchableOpacity>
        )}

        {/* Intro Stage */}
        {stage === 'intro' && (
          <View style={styles.content}>
            <View style={styles.lockIcon}>
              <Ionicons name="shield-checkmark" size={80} color="#A78BFA" />
            </View>

            <Text style={styles.title}>Prova Zero-Knowledge 🔐</Text>
            <Text style={styles.subtitle}>
              Verificação de Saldo XLM
            </Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Requer Mínimo:</Text>
                <View style={styles.xlmBadge}>
                  <Text style={styles.xlmAmount}>{xlmRequired} XLM</Text>
                </View>
              </View>
            </View>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="lock-closed" size={24} color="#18181B" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Privacidade Total</Text>
                  <Text style={styles.featureDescription}>
                    Seu saldo não é revelado
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="flash" size={24} color="#18181B" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Verificação Instantânea</Text>
                  <Text style={styles.featureDescription}>
                    Prova matemática garantida
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={styles.featureIcon}>
                  <Ionicons name="shield-checkmark" size={24} color="#18181B" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>Zero Conhecimento</Text>
                  <Text style={styles.featureDescription}>
                    Apenas prova que você tem o mínimo
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.generateButton}
              onPress={handleStartProof}
              activeOpacity={0.8}
            >
              <Ionicons name="key" size={24} color="#18181B" />
              <Text style={styles.generateButtonText}>Gerar Prova ZK</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Generating Stage */}
        {stage === 'generating' && (
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.generatingIcon,
                {
                  transform: [
                    { rotate },
                    { scale: pulseAnim },
                  ],
                },
              ]}
            >
              <Ionicons name="key" size={80} color="#A78BFA" />
            </Animated.View>

            <Text style={styles.generatingTitle}>Gerando Prova ZK...</Text>
            <Text style={styles.generatingSubtitle}>
              Computando prova criptográfica
            </Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{Math.round(progress)}%</Text>
            </View>

            {/* Steps */}
            <View style={styles.stepsList}>
              <View style={[styles.stepItem, progress > 20 && styles.stepItemComplete]}>
                <View style={styles.stepIcon}>
                  {progress > 20 ? (
                    <Ionicons name="checkmark" size={16} color="#4ADE80" />
                  ) : (
                    <View style={styles.stepDot} />
                  )}
                </View>
                <Text style={styles.stepText}>Conectando à carteira</Text>
              </View>

              <View style={[styles.stepItem, progress > 40 && styles.stepItemComplete]}>
                <View style={styles.stepIcon}>
                  {progress > 40 ? (
                    <Ionicons name="checkmark" size={16} color="#4ADE80" />
                  ) : (
                    <View style={styles.stepDot} />
                  )}
                </View>
                <Text style={styles.stepText}>Verificando saldo</Text>
              </View>

              <View style={[styles.stepItem, progress > 60 && styles.stepItemComplete]}>
                <View style={styles.stepIcon}>
                  {progress > 60 ? (
                    <Ionicons name="checkmark" size={16} color="#4ADE80" />
                  ) : (
                    <View style={styles.stepDot} />
                  )}
                </View>
                <Text style={styles.stepText}>Gerando commitment</Text>
              </View>

              <View style={[styles.stepItem, progress > 80 && styles.stepItemComplete]}>
                <View style={styles.stepIcon}>
                  {progress > 80 ? (
                    <Ionicons name="checkmark" size={16} color="#4ADE80" />
                  ) : (
                    <View style={styles.stepDot} />
                  )}
                </View>
                <Text style={styles.stepText}>Calculando prova</Text>
              </View>
            </View>
          </View>
        )}

        {/* Success Stage */}
        {stage === 'success' && (
          <View style={styles.content}>
            <Animated.View
              style={[
                styles.successIcon,
                {
                  transform: [{ scale: scaleAnim }],
                },
              ]}
            >
              <Ionicons name="checkmark-circle" size={120} color="#4ADE80" />
            </Animated.View>

            <Text style={styles.successTitle}>Prova Gerada! ✨</Text>
            <Text style={styles.successSubtitle}>
              Verificação concluída com sucesso
            </Text>

            <View style={styles.proofCard}>
              <Text style={styles.proofLabel}>Prova ZK</Text>
              <Text style={styles.proofHash}>
                zk_0x4a7b...9f3c
              </Text>
              <Text style={styles.proofDetails}>
                Válido até: {new Date(Date.now() + 3600000).toLocaleString('pt-BR')}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleComplete}
              activeOpacity={0.8}
            >
              <Text style={styles.completeButtonText}>Continuar Registro</Text>
              <Ionicons name="arrow-forward" size={24} color="#18181B" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
    justifyContent: 'center',
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
  },
  lockIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 8,
    letterSpacing: -1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#71717A',
    marginBottom: 32,
    textAlign: 'center',
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#A78BFA',
    padding: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181B',
  },
  xlmBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#18181B',
  },
  xlmAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
  },
  featuresList: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FBBF24',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#18181B',
  },
  featureText: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#71717A',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#FBBF24',
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
  generateButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: 0.3,
  },
  generatingIcon: {
    marginBottom: 32,
  },
  generatingTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  generatingSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#71717A',
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#18181B',
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A78BFA',
  },
  progressText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#18181B',
  },
  stepsList: {
    width: '100%',
    gap: 12,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  stepItemComplete: {
    borderColor: '#4ADE80',
    backgroundColor: '#F0FDF4',
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  stepText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#18181B',
    flex: 1,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 8,
    letterSpacing: -1,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#71717A',
    marginBottom: 32,
    textAlign: 'center',
  },
  proofCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#18181B',
    shadowColor: '#18181B',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    marginBottom: 32,
    alignItems: 'center',
  },
  proofLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#71717A',
    marginBottom: 8,
  },
  proofHash: {
    fontSize: 20,
    fontWeight: '800',
    color: '#A78BFA',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  proofDetails: {
    fontSize: 13,
    fontWeight: '600',
    color: '#71717A',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#4ADE80',
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
  completeButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18181B',
    letterSpacing: 0.3,
  },
});

