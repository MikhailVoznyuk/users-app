"use client";
import { useEffect, useState } from "react";

export type Group = { id: number; name: string };
export type UserInput = {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  groupId?: number | null;
};

export default function UserForm({
  value,
  groups,
  onSubmit
}: {
  value?: Partial<UserInput>;
  groups: Group[];
  onSubmit: (data: UserInput) => Promise<void>;
}) {
  const [form, setForm] = useState<UserInput>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    groupId: null,
    ...value
  });

  useEffect(() => setForm((p) => ({ ...p, ...value })), [value]);

  return (
    <form
      className="card space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await onSubmit(form);
      }}
    >
      <div className="grid md:grid-cols-2 gap-3">
        <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Имя" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
        <input className="input" placeholder="Фамилия" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
        <input className="input" placeholder="Телефон" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select className="select" value={String(form.groupId)} onChange={(e) => setForm({ ...form, groupId: e.target.value === "null" ? null : Number(e.target.value) })}>
          <option value="null">Без группы</option>
          {groups.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>
      <button className="btn" type="submit">Сохранить</button>
    </form>
  );
}
