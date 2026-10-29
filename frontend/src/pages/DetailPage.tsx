import { useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import type { AppOutletContext } from '../AppLayout';
import { DEFAULT_IMAGE, ServiceImage } from '../components/ServiceImage';
import { getServiceById } from '../modules/servicesApi';
import type { InsulinService } from '../modules/servicesApi';
import { SERVICES_MOCK } from '../modules/mock';
import { ROUTES } from '../Routes';

export function DetailPage() {
  const { id = '' } = useParams();
  const { cards } = useOutletContext<AppOutletContext>();
  const [loaded, setLoaded] = useState<InsulinService>();
  const [loading, setLoading] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const cached = cards.find((card) => String(card.id) === id);
  const item = cached ?? (String(loaded?.id) === id ? loaded : undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    setLoaded(undefined);
    setVideoFailed(false);
    setLoading(false);
    if (!cached && /^[1-9]\d*$/.test(id)) {
      setLoading(true);
      getServiceById(id, controller.signal)
        .then((data) => { if (!controller.signal.aborted) setLoaded(data); })
        .catch(() => {
          if (!controller.signal.aborted)
            setLoaded(SERVICES_MOCK.find((card) => String(card.id) === id));
        })
        .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }
    return () => controller.abort();
  }, [id, cached]);

  const index = cards.findIndex((card) => String(card.id) === id);
  const next = index >= 0 ? cards[index + 1] : undefined;

  if (loading) return <div className="loading" role="status"><Spinner animation="border" /> Загрузка…</div>;
  if (!item) return <section className="listPage"><h1>Расчёт не найден</h1>
    <Link to={ROUTES.LIST}>Вернуться к списку</Link></section>;

  return <article className="detailPage">
    {item.videoUrl && !videoFailed
      ? <video key={item.videoUrl} className="detailMedia" src={item.videoUrl}
          poster={item.imageUrl || DEFAULT_IMAGE} autoPlay loop muted playsInline controls
          onError={() => setVideoFailed(true)} aria-label={item.name} />
      : <ServiceImage className="detailMedia" src={item.imageUrl} alt={item.name} />}
    <div className="detailText">
      <h1>{item.name}</h1><p>{item.description}</p>
      <dl><div><dt>Возраст</dt><dd>{item.age ?? '—'} лет</dd></div>
        <div><dt>Вес</dt><dd>{item.weight ?? '—'} кг</dd></div>
        <div><dt>Коэффициент</dt><dd>{item.sensitivityCoefficient ?? '—'}</dd></div></dl>
      <Button className="nextButton" disabled={!next}
        onClick={() => next && navigate(`${ROUTES.DETAIL}/${next.id}`)}>Далее</Button>
      {!next && <p className="endMessage">{index >= 0 ? 'Последняя карточка списка' : 'Для перехода «Далее» откройте список и выполните поиск'}</p>}
    </div>
  </article>;
}
