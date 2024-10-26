import { TileEnum } from './TileEnum';
import { PointType } from './PointType';

export type TileProps = {
  row: number;
  column: number;
  type: TileEnum;
  startPoint?: PointType;
  finishPoint?: PointType;
  onStartPointChange?: (x: number, y: number) => void;
  onFinishPointChange?: (x: number, y: number) => void;
  active: boolean;
};
