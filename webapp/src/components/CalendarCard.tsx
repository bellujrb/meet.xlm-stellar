
import { Calendar } from '../types';
import styles from './CalendarCard.module.css';

type CalendarCardProps = Omit<Calendar, 'id' | 'color' | 'eventCount'> & {
  onPress?: () => void;
};

export default function CalendarCard({
  name,
  image,
  onPress,
}: CalendarCardProps) {
  return (
    <div 
      className={styles.calendarCard} 
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
      <img src={image} alt={name} className={styles.calendarImage} />
      <div className={styles.overlay}>
        <span className={styles.calendarName}>{name}</span>
      </div>
    </div>
  );
}

