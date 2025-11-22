import { IoTimeOutline, IoLocationOutline } from 'react-icons/io5';
import { Event } from '../types';
import { DEFAULT_EVENT_IMAGE } from '../config/constants';
import styles from './EventCard.module.css';

type EventCardProps = Omit<Event, 'id' | 'description' | 'attendees'> & {
  onPress?: () => void;
  confirmed?: boolean;
};

export default function EventCard({
  title,
  organizer,
  organizerIcon,
  time,
  location,
  image,
  status,
  statusTime,
  onPress,
  confirmed = false,
}: EventCardProps) {
  return (
    <div 
      className={styles.eventCard} 
      onClick={onPress}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPress?.();
        }
      }}
    >
      <div className={styles.imageContainer}>
        <img src={image || DEFAULT_EVENT_IMAGE} alt={title} className={styles.eventImage} />
        {confirmed && (
          <div className={styles.confirmBadge}>
            <span className={styles.confirmBadgeText}>Confirmed</span>
          </div>
        )}
      </div>
      <div className={styles.eventContent}>
        <div className={styles.eventHeader}>
          <div className={styles.organizerContainer}>
            <span className={styles.organizerIcon}>{organizerIcon}</span>
            <span className={styles.organizer} title={organizer}>
              {organizer}
            </span>
          </div>
          <div
            className={`${styles.statusBadge} ${status === 'LIVE' ? styles.statusBadgeLive : ''}`}
          >
            <span 
              className={`${styles.statusText} ${status === 'LIVE' ? styles.statusTextLive : ''}`}
            >
              {status === 'LIVE' ? 'LIVE' : statusTime}
            </span>
          </div>
        </div>

        <h3 className={styles.eventTitle}>{title}</h3>

        <div className={styles.eventDetails}>
          <div className={styles.eventDetailRow}>
            <IoTimeOutline size={16} color="#666" />
            <span className={styles.eventDetailText}>{time}</span>
          </div>
          <div className={styles.eventDetailRow}>
            <IoLocationOutline size={16} color="#666" />
            <span className={styles.eventDetailText}>{location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

