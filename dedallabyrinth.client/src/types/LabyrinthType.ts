import { TileEnum } from './TileEnum';

export type LabyrinthType = {
  id: number;
  name: string;
  matrix: TileEnum[][];
  rowCount: number;
  colCount: number;
};
