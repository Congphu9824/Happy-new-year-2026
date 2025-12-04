export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface WishResponse {
  wish: string;
}