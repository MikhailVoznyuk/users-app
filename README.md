# Users App

Тестовое приложение: список пользователей и их групп.
Фронтенд: **Next.js + TypeScript + TailwindCSS**
Бэкенд: **Node.js + Express + Prisma + PostgreSQL**

## Функционал

- Страница со списком пользователей (поиск, сортировка, пагинация).
- Страница отдельного пользователя с деталями.
- Группы пользователей (Руководство, Бухгалтерия и т.д.).
- CRUD для пользователей (создание, редактирование).
- Бэкап/восстановление пользователей в/из файла.
- Адаптивная верстка (desktop / mobile).

## Технологии

- **Next.js 14** (App Router) + TailwindCSS — фронтенд.
- **Express** + **Prisma** + **PostgreSQL** — бэкенд.
- **Docker Compose** для локального запуска.
- **Faker.js** для генерации тестовых данных.
- **Prisma Client** для работы с БД.

## Запуск

Требуется **Docker** и **Docker Compose**.

```bash
git clone https://github.com/MikhailVoznyuk/users-app.git
cd users-app
docker compose up --build
```
