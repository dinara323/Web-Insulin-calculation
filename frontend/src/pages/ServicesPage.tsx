import { useEffect, useRef, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { AppOutletContext } from '../AppLayout';
import { InputField } from '../components/InputField';
import { ServiceCard } from '../components/ServiceCard';
import { getServices } from '../modules/servicesApi';
import { searchMock } from '../modules/mock';
import { ROUTES } from '../Routes';

export function ServicesPage() {
  const { cards, setCards, searchValue, setSearchValue, source, setSource } =
    useOutletContext<AppOutletContext>();
  const [loading, setLoading] = useState(false);
  const request = useRef<AbortController>();
  const navigate = useNavigate();

  // Начальный mock виден сразу; запрос к своему API выполняется кнопкой поиска.
  useEffect(() => () => request.current?.abort(), []);

  async function handleSearch() {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    try {
      const results = await getServices(searchValue, controller.signal);
      if (controller.signal.aborted) return;
      if (results.length) {
        setCards(results);
        setSource('Данные собственного API');
      } else {
        setCards(searchMock(searchValue));
        setSource('API вернул пустой список. Учебные данные (mock): совпадения или все примеры.');
      }
    } catch {
      if (controller.signal.aborted) return;
      setCards(searchMock(searchValue));
      setSource('API недоступен. Учебные данные (mock): совпадения или все примеры.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  return <section className="listPage">
    <header><p className="eyebrow">Лабораторная работа №5</p>
      <h1>Чувствительность к инсулину</h1></header>
    <InputField value={searchValue} setValue={setSearchValue}
      onSubmit={handleSearch} loading={loading} />
    <p className="source" role="status">{source}</p>
    {loading && <div className="loading" role="status">
      <Spinner animation="border" size="sm" /> Загрузка…</div>}
    {!cards.length && <p role="status">Расчёты не найдены. Попробуйте другое название.</p>}
    <div className="cardsList" aria-busy={loading}>
      {cards.map((item) => <ServiceCard key={item.id} item={item}
        onClick={() => navigate(`${ROUTES.DETAIL}/${item.id}`)} />)}
    </div>
  </section>;
}
