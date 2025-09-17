"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SearchBox from "./SearchBox";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Group = { id: number; name: string };

type User = {
  id: number; email: string; firstName: string; lastName: string; phone?: string | null; group?: Group | null
};

type ListResponse = { items: User[]; total: number; page: number; pageSize: number };

const columns = [
  { key: "lastName", title: "Фамилия" },
  { key: "firstName", title: "Имя" },
  { key: "email", title: "Email" },
  { key: "group", title: "Группа" }
] as const;

export default function UserTable() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [groupId, setGroupId] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [data, setData] = useState<ListResponse | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    fetch(`${API}/api/groups`).then(r => r.json()).then(setGroups);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ q, sort, order, page: String(page), pageSize: String(pageSize) });
    if (groupId) params.set("groupId", groupId);
    fetch(`${API}/api/users?` + params.toString()).then(r => r.json()).then(setData);
  }, [q, sort, order, page, pageSize, groupId]);

  const totalPages = useMemo(() => data ? Math.ceil(data.total / data.pageSize) : 1, [data]);

  return (
    <div className="space-y-4">
      <div className="card flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 items-center">
          <SearchBox onChange={(v) => { setPage(1); setQ(v); }} />
          <select className="select w-[220px]" value={groupId} onChange={(e) => { setPage(1); setGroupId(e.target.value); }}>
            <option value="">Все группы</option>
            <option value="null">Без группы</option>
            {groups.map(g => <option key={g.id} value={String(g.id)}>{g.name}</option>)}
          </select>
          <select className="select" value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}>
            {[10,20,50,100].map(n => <option key={n} value={n}>{n}/стр</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="createdAt">По дате</option>
            <option value="lastName">Фамилия</option>
            <option value="firstName">Имя</option>
            <option value="email">Email</option>
          </select>
          <select className="select" value={order} onChange={(e) => setOrder(e.target.value as any)}>
            <option value="asc">Возр.</option>
            <option value="desc">Убыв.</option>
          </select>
          <Link href="/users/new" className="btn">Добавить</Link>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="tr">
              {columns.map(c => <th key={c.key} className="th">{c.title}</th>)}
              <th className="th text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map(u => (
              <tr key={u.id} className="tr">
                <td className="td">{u.lastName}</td>
                <td className="td">{u.firstName}</td>
                <td className="td">{u.email}</td>
                <td className="td">{u.group?.name || "Без группы"}</td>
                <td className="td text-right">
                  <Link href={`/users/${u.id}`} className="btn">Открыть</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!data && <div className="py-6 text-center text-neutral-500">Загрузка…</div>}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-500">Всего: {data?.total ?? 0}</div>
        <div className="flex gap-2 items-center">
          <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p-1))}>Назад</button>
          <div className="px-2">{page} / {totalPages}</div>
          <button className="btn" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p+1))}>Вперёд</button>
        </div>
      </div>
    </div>
  );
}
