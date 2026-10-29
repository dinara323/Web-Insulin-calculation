import { Button, Form } from 'react-bootstrap';

interface Props {
  value: string;
  setValue: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function InputField({ value, setValue, onSubmit, loading }: Props) {
  return <Form className="searchForm" onSubmit={(event) => {
    event.preventDefault();
    onSubmit();
  }}>
    <Form.Label htmlFor="search">Название расчёта</Form.Label>
    <div className="searchRow">
      <Form.Control id="search" type="search" placeholder="Введите название"
        value={value} onChange={(event) => setValue(event.target.value)} />
      <Button type="submit" disabled={loading}>Искать</Button>
    </div>
  </Form>;
}
