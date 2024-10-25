import { LabyrinthType } from './LabyrinthType';

export type LabyrinthProps = {
  labyrinth: LabyrinthType;
  onStartPointChange?: (x: number, y: number) => void;
  onFinishPointChange?: (x: number, y: number) => void;
  active: boolean;
};
