import { TileEnum } from '../../types/TileEnum';
import { TileProps } from '../../types/TileProps';
import styles from './Tile.module.css';

const Tile: React.FC<TileProps> = ({
  row,
  column,
  type,
  onClick,
  onStartPointChange,
  onFinishPointChange,
  active = true,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent default context menu on right click
    event.preventDefault();

    if ((type as TileEnum) == TileEnum.Wall) return;

    if (event.button === 0 && onStartPointChange) {
      // Left click
      onStartPointChange(row, column);
    } else if (event.button === 2 && onFinishPointChange) {
      // Right click
      onFinishPointChange(row, column);
    }

    onClick?.(event);
  };

  return (
    <div
      className={`${styles.Tile} ${active ? styles[`enabled`] : ''} ${
        styles[`type${type}`]
      }`}
      onClick={handleClick}
      onContextMenu={handleClick}
    ></div>
  );
};

export default Tile;
