export enum Tab {
  FERRIS_WHEEL = 'FERRIS_WHEEL',
  FUNCTION_PLOTTER = 'FUNCTION_PLOTTER'
}

export interface TrigState {
  angle: number; // in radians
}

export interface PlotParams {
  A: number;
  omega: number;
  phi: number; // coefficient of PI
  k: number;
}