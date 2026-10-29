import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Outlet } from 'react-router-dom';
import { TabBar } from './components/TabBar';
import { SERVICES_MOCK } from './modules/mock';
import type { InsulinService } from './modules/servicesApi';

export interface AppOutletContext {
  cards: InsulinService[];
  setCards: Dispatch<SetStateAction<InsulinService[]>>;
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  source: string;
  setSource: Dispatch<SetStateAction<string>>;
}

export function AppLayout() {
  const [cards, setCards] = useState(SERVICES_MOCK);
  const [searchValue, setSearchValue] = useState('');
  const [source, setSource] = useState('Учебные данные (mock)');
  const context: AppOutletContext = {
    cards, setCards, searchValue, setSearchValue, source, setSource,
  };
  return <div className="appShell">
    <main className="appContent">
      <Outlet context={context} />
    </main>
    <TabBar cards={cards} />
  </div>;
}
