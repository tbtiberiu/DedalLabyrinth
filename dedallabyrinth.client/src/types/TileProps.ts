import { MouseEventHandler } from 'react';
import { TileEnum } from './TileEnum';

export type TileProps = {
  row: number;
  column: number;
  type: TileEnum;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  onStartPointChange?: (x: number, y: number) => void;
  onFinishPointChange?: (x: number, y: number) => void;
  active: boolean;
};
