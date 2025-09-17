"use client";
import { useEffect, useState } from "react";
import UserForm, { Group, UserInput } from "@/components/UserForm";
import { useRouter, useParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function UserPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";
  const [groups, setGroups] = useState<Group[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => { fetch(`${API}/api/groups`).then(r => r.json()).then(setGroups); }, []);
  useEffect(() => { if (!isNew) fetch(`${API}/api/users/${params.id}`).then(r => r.json()).then(setUser); }, [params.id]);

  async function onSubmit(data: UserInput) {
    const url = isNew ? `${API}/api/users` : `${API}/api/users/${params.id}`;
    const method = isNew ? "POST" : "PATCH";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (!res.ok) { alert("Ошибка сохранения"); return; }
    router.push("/users");
  }

  return (
    <div className="space-y-4">
      <UserForm value={user ?? {}} groups={groups} onSubmit={onSubmit} />
    </div>
  );
}
