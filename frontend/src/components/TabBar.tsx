import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES, ROUTE_LABELS } from '../Routes';
import type { InsulinService } from '../modules/servicesApi';

export function TabBar({ cards }: { cards: InsulinService[] }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return <nav className="tabBar" aria-label="Основная навигация">
    <button type="button" aria-current={pathname === ROUTES.LIST ? 'page' : undefined}
      onClick={() => navigate(ROUTES.LIST)}>
      <span aria-hidden="true">▤</span>{ROUTE_LABELS.LIST}
    </button>
    <button type="button" disabled={!cards.length}
      aria-current={pathname.startsWith(`${ROUTES.DETAIL}/`) ? 'page' : undefined}
      onClick={() => cards[0] && navigate(`${ROUTES.DETAIL}/${cards[0].id}`)}>
      <span aria-hidden="true">▷</span>{ROUTE_LABELS.DETAIL}
    </button>
  </nav>;
}
