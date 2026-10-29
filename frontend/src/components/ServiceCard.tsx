import type { InsulinService } from '../modules/servicesApi';
import { ServiceImage } from './ServiceImage';

export function ServiceCard({ item, onClick }: { item: InsulinService; onClick: () => void }) {
  return <button type="button" className="serviceCard" onClick={onClick}>
    <ServiceImage className="cardImage" src={item.imageUrl} alt={item.name} />
    <span className="cardText">
      <strong>{item.name}</strong>
      <span>Возраст: {item.age ?? '—'} · Вес: {item.weight ?? '—'} кг</span>
      <span>Коэффициент: {item.sensitivityCoefficient ?? '—'}</span>
    </span>
    <span aria-hidden="true">›</span>
  </button>;
}
