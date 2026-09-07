import { InsulinService } from './insulin.types';

export const insulinServices: InsulinService[] = [
  {
    id: 1,
    name: 'Расчёт по хлебным единицам',
    description:
      'Расчёт пищевой составляющей болюсной дозы по количеству хлебных единиц.',

    calculationType: 'xe',

    isf: null,
    insulinPerXe: 1,
    targetGlucose: null,

    status: 'опубликован',

    imageUrl:
      'http://localhost:9000/media/breakfast.png',

    videoUrl:
      'http://localhost:9000/media/XRecorder_20260907_01.mp4',

    likes: [1, 2, 3, 4],
  },

  {
    id: 2,
    name: 'Коррекция уровня глюкозы',
    description:
      'Расчёт корректирующей составляющей относительно целевого уровня глюкозы.',

    calculationType: 'correction',

    isf: 2.5,
    insulinPerXe: null,
    targetGlucose: 6,

    status: 'опубликован',

    imageUrl:
      'http://localhost:9000/media/correction.png',

    videoUrl:
      'http://localhost:9000/media/XRecorder_20260907_03.mp4',

    likes: [1, 3, 5],
  },

  {
    id: 3,
    name: 'Расчёт болюса: еда + коррекция',
    description:
      'Комбинированный расчёт пищевой и корректирующей составляющих.',

    calculationType: 'combined',

    isf: 3,
    insulinPerXe: 1.2,
    targetGlucose: 6,

    status: 'опубликован',

    imageUrl:
      'http://localhost:9000/media/xe.png',

    videoUrl:
      'http://localhost:9000/media/XRecorder_20260907_04.mp4',

    likes: [2, 4, 6, 8, 9],
  },

  {
    id: 4,
    name: 'Индивидуальный расчёт',
    description:
      'Индивидуальный расчёт с учётом активного инсулина.',

    calculationType: 'individual',

    isf: 4,
    insulinPerXe: 0.8,
    targetGlucose: 5.5,

    status: 'опубликован',

    imageUrl:
      'http://localhost:9000/media/individual.png',

    videoUrl:
      'http://localhost:9000/media/XRecorder_20260907_01.mp4',

    likes: [1, 2, 7],
  },

  {
    id: 5,
    name: 'Новый индивидуальный расчёт',
    description:
      'Черновая версия услуги с индивидуальными параметрами.',

    calculationType: 'individual',

    isf: 3.5,
    insulinPerXe: 1.1,
    targetGlucose: 5.8,

    status: 'черновик',

    imageUrl:
      'http://localhost:9000/media/individual.png',

    videoUrl:
      'http://localhost:9000/media/XRecorder_20260907_01.mp4',

    likes: [],
  },

  {
    id: 6,
    name: 'Удалённая услуга',
    description:
      'Эта услуга не должна отображаться пользователю.',

    calculationType: 'combined',

    isf: 2,
    insulinPerXe: 1,
    targetGlucose: 6,

    status: 'удален',

    imageUrl:
      'http://localhost:9000/media/breakfast.png',

    videoUrl:
      'http://localhost:9000/media/XRecorder_20260907_01.mp4',

    likes: [1],
  },
];