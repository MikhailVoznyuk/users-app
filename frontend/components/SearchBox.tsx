"use client";
import { useEffect, useState } from "react";

type Props = { onChange: (v: string) => void; initial?: string };
export default function SearchBox({ onChange, initial = "" }: Props) {
  const [val, setVal] = useState(initial);
  useEffect(() => {
    const t = setTimeout(() => onChange(val), 250);
    return () => clearTimeout(t);
  }, [val]);
  return (
    <input className="input" placeholder="Поиск..." value={val} onChange={(e) => setVal(e.target.value)} />
  );
}
