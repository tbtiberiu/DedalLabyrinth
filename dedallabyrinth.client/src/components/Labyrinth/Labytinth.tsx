import { LabyrinthProps } from '../../types/LabyrinthProps';
import Tile from '../Tile/Tile';
import styles from './Labyrinth.module.css';

const Labyrinth: React.FC<LabyrinthProps> = ({
  labyrinth,
  onStartPointChange,
  onFinishPointChange,
  active,
}) => {
  const handleClick = () => {};

  return (
    <div className={styles.Labyrinth}>
      <div className={styles.Wrapper}>
        {labyrinth.matrix.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.Row}>
            {row.map((tile, colIndex) => (
              <Tile
                active={active}
                row={rowIndex}
                column={colIndex}
                key={`${rowIndex}-${colIndex}`}
                type={tile}
                onClick={handleClick}
                onStartPointChange={onStartPointChange}
                onFinishPointChange={onFinishPointChange}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Labyrinth;
