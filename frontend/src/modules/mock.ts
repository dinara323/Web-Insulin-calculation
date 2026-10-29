import type { InsulinService } from './servicesApi';

// Непоследовательные ID показывают, что «Далее» работает по массиву, а не id + 1.
export const SERVICES_MOCK: InsulinService[] = [
  {
    id: 1, name: 'Расчёт для взрослого',
    description: 'Учебный пример расчёта коэффициента чувствительности к инсулину.',
    age: 35, weight: 70, sensitivityCoefficient: 4, imageUrl: null, videoUrl: null,
  },
  {
    id: 4, name: 'Расчёт после 60 лет',
    description: 'Учебный пример с учётом возрастной поправки.',
    age: 65, weight: 80, sensitivityCoefficient: 5, imageUrl: null, videoUrl: null,
  },
  {
    id: 9, name: 'Пример с небольшим весом',
    description: 'Учебная карточка для демонстрации поиска и переходов.',
    age: 25, weight: 50, sensitivityCoefficient: 4, imageUrl: null, videoUrl: null,
  },
];

export function searchMock(name: string): InsulinService[] {
  const results = SERVICES_MOCK.filter((item) =>
    item.name.toLocaleLowerCase('ru').startsWith(name.trim().toLocaleLowerCase('ru')),
  );
  // Как в п. 7.1 методички: при отсутствии совпадений показываем весь mock.
  return results.length ? results : SERVICES_MOCK;
}
