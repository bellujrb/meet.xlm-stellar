import styles from './EventCardSkeleton.module.css';

export default function EventCardSkeleton() {
  return (
    <div className={styles.eventCardSkeleton}>
      <div className={styles.imageSkeleton} />
      <div className={styles.contentSkeleton}>
        <div className={styles.headerSkeleton}>
          <div className={styles.organizerSkeleton}>
            <div className={styles.organizerIconSkeleton} />
            <div className={styles.organizerTextSkeleton} />
          </div>
          <div className={styles.statusBadgeSkeleton} />
        </div>
        <div className={styles.titleSkeleton} />
        <div className={styles.detailsSkeleton}>
          <div className={styles.detailRowSkeleton} />
          <div className={styles.detailRowSkeleton} />
        </div>
      </div>
    </div>
  );
}

