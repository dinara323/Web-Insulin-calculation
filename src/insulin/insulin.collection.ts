import { InsulinService } from './insulin.types';

export const insulinServices: InsulinService[] = [
  {
    id: 1,
    name: 'Базовый расчёт болюсной дозы',
    description:
      'Расчёт болюсной дозы инсулина с учётом хлебных единиц.',
    isf: 2.5,
    insulinPerXe: 1,
    targetGlucose: 6,
    status: 'опубликован',
    imageUrl: 'http://localhost:9000/media/correction.png',    videoUrl: 'https://example.com/breakfast.mp4',
    likes: [1, 2, 3, 4],
  },

  {
    id: 2,
    name: 'Расчёт с коррекцией глюкозы',
    description:
      'Расчёт с учётом текущего и целевого уровня глюкозы.',
    isf: 3,
    insulinPerXe: 1,
    targetGlucose: 6,
    status: 'опубликован',
    imageUrl: 'http://localhost:9000/media/xe.png',
    videoUrl: 'https://example.com/correction.mp4',
    likes: [1, 3, 5],
  },

  {
    id: 3,
    name: 'Расчёт по хлебным единицам',
    description:
      'Расчёт количества инсулина на основе количества ХЕ.',
    isf: 2.5,
    insulinPerXe: 1.2,
    targetGlucose: 6,
    status: 'опубликован',
    imageUrl: 'http://localhost:9000/media/individual.png',
    videoUrl: 'https://example.com/xe.mp4',
    likes: [2, 4, 6, 8, 9],
  },

  {
    id: 4,
    name: 'Индивидуальный расчёт',
    description:
      'Индивидуальный набор параметров для расчёта.',
    isf: 4,
    insulinPerXe: 0.8,
    targetGlucose: 5.5,
    status: 'опубликован',
    imageUrl: 'https://placehold.co/600x800?text=Individual',
    videoUrl: 'https://example.com/individual.mp4',
    likes: [1, 2],
  },

  {
    id: 5,
    name: 'Новая услуга — черновик',
    description:
      'Черновая версия услуги, доступная на странице добавления.',
    isf: 2.5,
    insulinPerXe: 1,
    targetGlucose: 6,
    status: 'черновик',
    imageUrl: 'https://placehold.co/600x800?text=Draft',
    videoUrl: 'https://example.com/draft.mp4',
    likes: [],
  },

  {
    id: 6,
    name: 'Удалённая услуга',
    description: 'Эта услуга не должна отображаться пользователю.',
    isf: 3,
    insulinPerXe: 1,
    targetGlucose: 6,
    status: 'удален',
    imageUrl: 'https://placehold.co/600x800?text=Deleted',
    videoUrl: 'https://example.com/deleted.mp4',
    likes: [1],
  },
];