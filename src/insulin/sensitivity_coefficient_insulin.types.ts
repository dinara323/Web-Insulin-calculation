export type InsulinStatus =
  | 'черновик'
  | 'опубликован'
  | 'удален';

export interface InsulinService {
  id: number;
  name: string;
  description: string;
  moreText: string;
  age: number;
  weight: number;
  sensitivity_coefficient: number;
  status: InsulinStatus;
  imageUrl: string;
  videoUrl: string;
  likes: number[];
}