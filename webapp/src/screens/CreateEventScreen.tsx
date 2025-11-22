import React, { useState, useEffect } from 'react';
import { IoClose, IoImage, IoCalendar, IoLocation, IoShieldCheckmark } from 'react-icons/io5';
import styles from './CreateEventScreen.module.css';

interface CreateEventScreenProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (eventName: string, eventDate: string) => void;
}

export default function CreateEventScreen({
  visible,
  onClose,
  onSuccess,
}: CreateEventScreenProps) {
  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [requireXLM, setRequireXLM] = useState(false);
  const [xlmAmount, setXlmAmount] = useState('');
  const [errors, setErrors] = useState({
    eventName: '',
    startDate: '',
    location: '',
  });

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [visible]);

  const handleCreateEvent = () => {
    const newErrors = {
      eventName: '',
      startDate: '',
      location: '',
    };

    let hasError = false;
    
    if (!eventName.trim()) {
      newErrors.eventName = 'Event name is required';
      hasError = true;
    }
    
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
      hasError = true;
    }
    
    if (!location.trim()) {
      newErrors.location = 'Location is required';
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    onSuccess(eventName, startDate);
    
    setEventName('');
    setStartDate('');
    setLocation('');
    setDescription('');
    setRequireXLM(false);
    setXlmAmount('');
    setErrors({ eventName: '', startDate: '', location: '' });
    
    onClose();
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <span className={styles.headerEmoji}>✨</span>
            </div>
            <h2 className={styles.headerTitle}>Create Event</h2>
          </div>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">
            <IoClose size={28} />
          </button>
        </div>

        <div className={styles.scrollView}>
          <div className={styles.content}>
            <div className={styles.imagePlaceholder}>
              <div className={styles.imagePlaceholderContent}>
                <div className={styles.imageIcon}>
                  <IoImage size={48} />
                </div>
                <div className={styles.imagePlaceholderText}>Add Cover</div>
                <div className={styles.imagePlaceholderSubtext}>Tap to add an image</div>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Event Name ✨</label>
              <input
                className={`${styles.input} ${errors.eventName ? styles.inputError : ''}`}
                placeholder="Ex: Stellar Hack+ Buenos Aires"
                value={eventName}
                onChange={(e) => {
                  setEventName(e.target.value);
                  setErrors({ ...errors, eventName: '' });
                }}
              />
              {errors.eventName && (
                <div className={styles.errorContainer}>
                  <span className={styles.errorText}>{errors.eventName}</span>
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Start Date 🕐</label>
              <div className={`${styles.dateInput} ${errors.startDate ? styles.inputError : ''}`}>
                <IoCalendar size={20} color="#71717A" />
                <input
                  type="datetime-local"
                  className={styles.dateInputField}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setErrors({ ...errors, startDate: '' });
                  }}
                />
              </div>
              {errors.startDate && (
                <div className={styles.errorContainer}>
                  <span className={styles.errorText}>{errors.startDate}</span>
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Location 📍</label>
              <div className={`${styles.locationInput} ${errors.location ? styles.inputError : ''}`}>
                <IoLocation size={20} color="#71717A" />
                <input
                  className={styles.locationInputText}
                  placeholder="Enter address..."
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors({ ...errors, location: '' });
                  }}
                />
              </div>
              {errors.location && (
                <div className={styles.errorContainer}>
                  <span className={styles.errorText}>{errors.location}</span>
                </div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Description 📝</label>
              <textarea
                className={`${styles.input} ${styles.textArea}`}
                placeholder="Add Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className={styles.ticketsSection}>
              <div className={styles.sectionHeaderRow}>
                <h3 className={styles.sectionTitle}>Tickets</h3>
                <span className={styles.sectionEmoji}>🎫</span>
              </div>

              <div className={styles.xlmRequirementCard}>
                <div className={styles.xlmRequirementHeader}>
                  <div className={styles.xlmRequirementLeft}>
                    <div className={styles.xlmIcon}>
                      <span className={styles.xlmIconText}>$</span>
                    </div>
                    <div>
                      <div className={styles.xlmRequirementTitle}>Require Minimum XLM</div>
                      <div className={styles.xlmRequirementSubtitle}>
                        Participants must have balance
                      </div>
                    </div>
                  </div>
                  <label className={styles.switch}>
                    <input
                      type="checkbox"
                      checked={requireXLM}
                      onChange={(e) => setRequireXLM(e.target.checked)}
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                {requireXLM && (
                  <div className={styles.xlmAmountContainer}>
                    <label className={styles.xlmAmountLabel}>Minimum amount</label>
                    <div className={styles.xlmAmountInputContainer}>
                      <input
                        type="number"
                        className={styles.xlmAmountInput}
                        placeholder="0.00"
                        value={xlmAmount}
                        onChange={(e) => setXlmAmount(e.target.value)}
                      />
                      <div className={styles.xlmBadge}>
                        <span className={styles.xlmBadgeText}>XLM</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ height: 120 }} />
        </div>

        <div className={styles.footer}>
          <button
            className={styles.createButton}
            onClick={handleCreateEvent}
          >
            <IoShieldCheckmark size={24} />
            <span className={styles.createButtonText}>Create Event</span>
          </button>
        </div>
      </div>
    </div>
  );
}

