import { LabyrinthType } from './LabyrinthType';
import { PointType } from './PointType';

export type LabyrinthProps = {
  labyrinth: LabyrinthType;
  startPoint?: PointType;
  finishPoint?: PointType;
  onStartPointChange?: (x: number, y: number) => void;
  onFinishPointChange?: (x: number, y: number) => void;
  active: boolean;
};
