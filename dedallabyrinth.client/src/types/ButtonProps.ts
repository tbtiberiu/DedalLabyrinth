import { MouseEventHandler, ReactNode } from 'react';

export type ButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
  children: ReactNode;
};
