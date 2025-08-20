import styles from './loading.module.css'
import {
    memo
} from 'react'
const Loading = () => {
  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.title}>PantryChef</div>
        <div className={styles.subtitle}>你的厨房助理</div>
      </div>
    </div>
  );
};

export default memo(Loading);