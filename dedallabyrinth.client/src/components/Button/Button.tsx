import { ButtonProps } from '../../types/ButtonProps';
import styles from './Button.module.css';

const Button: React.FC<ButtonProps> = ({ onClick, children }) => {
  return (
    <button className={styles.Button} type="button" onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
