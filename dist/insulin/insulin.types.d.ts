export type CalculationType = 'xe' | 'correction' | 'combined' | 'individual';
export type InsulinService = {
    id: number;
    name: string;
    description: string;
    moreText: string;
    calculationType: CalculationType;
    isf: number | null;
    insulinPerXe: number | null;
    targetGlucose: number | null;
    status: 'черновик' | 'опубликован' | 'удален';
    imageUrl: string;
    videoUrl: string;
    likes: number[];
};
