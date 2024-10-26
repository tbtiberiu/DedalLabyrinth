import { TileEnum } from './TileEnum';

export type LabyrinthType = {
  id: number;
  name: string;
  matrix: TileEnum[][];
  rowCount: number;
  colCount: number;
  path: { item1: number; item2: number }[];
};
