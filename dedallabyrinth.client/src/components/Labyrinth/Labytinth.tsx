import { LabyrinthProps } from '../../types/LabyrinthProps';
import Tile from '../Tile/Tile';
import styles from './Labyrinth.module.css';

const Labyrinth: React.FC<LabyrinthProps> = ({
  labyrinth,
  startPoint,
  finishPoint,
  onStartPointChange,
  onFinishPointChange,
  active,
}) => {
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
                startPoint={startPoint}
                finishPoint={finishPoint}
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
