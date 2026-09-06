export type InsulinService = {
  id: number;
  name: string;
  description: string;

  isf: number;
  insulinPerXe: number;
  targetGlucose: number;

  status: 'черновик' | 'опубликован' | 'удален';

  imageUrl: string;
  videoUrl: string;

  likes: number[];
};