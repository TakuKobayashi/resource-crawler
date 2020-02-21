import { ResourceResult } from './resourceResult';

export interface ApiRenderTemplate {
  message: string;
  executed_millisecond: number;
  results: ResourceResult[];
  timestamp: number;
}
