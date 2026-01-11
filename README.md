# TravelTrucks

Frontend веб-додатку для компанії **TravelTrucks**, яка займається орендою кемперів.  
Проєкт реалізований на **Next.js (App Router)** з **TypeScript**, стан керується через **Zustand**, запити виконуються через **Axios**, стилі — **CSS Modules**.

---

## Основні сторінки

- **/** — Home (Hero банер + кнопка “View Now” → перехід в каталог)
- **/catalog** — Catalog (список кемперів + фільтри + обране + Load more)
- **/catalog/:id** — Camper details (галерея, опис, вкладки Features/Reviews, форма бронювання)

---

## Функціонал

### Каталог

- Отримання списку кемперів з бекенду (MockAPI).
- **Фільтрація на бекенді**:
  - Location (текстове поле)
  - Vehicle type (обирається один тип)
  - Equipment (можна обрати декілька): AC, Kitchen, TV, Bathroom, Automatic
- **Пагінація на бекенді** та кнопка **Load more** (довантаження карток з урахуванням фільтрів).
- **Обране**:
  - можна додати/видалити кемпер з favorites
  - список обраного зберігається після оновлення сторінки (persist у localStorage)

### Сторінка кемпера

- Детальний опис, ціна, рейтинг, локація
- Галерея фото (до 4)
- Вкладки:
  - **Features** (активна за замовчуванням)
  - **Reviews** (відгуки з рейтингом у вигляді 5 зірок)
- **Форма бронювання** з нотифікацією про успішну відправку

---

## Технології

- **Next.js** (App Router)
- **TypeScript**
- **Zustand** (глобальний стан: campers, filters, favorites)
- **Axios** (HTTP запити)
- **CSS Modules**
- **MockAPI** (бекенд)

---

## API

Бекенд (MockAPI):  
`https://66b1f8e71ca8ad33d4f5f63e.mockapi.io/campers`

Основні ендпоінти:

- `GET /campers` — список кемперів (фільтрація/пагінація через query params)
- `GET /campers/:id` — деталі кемпера

---

## Запуск проєкту локально

1. Клонувати репозиторій:

```bash
git clone https://github.com/Sensei8760/travel-trucks.git
cd traveltrucks
```

2. Встановити залежності:

npm install

3. Створити .env:

NEXT_PUBLIC_API_URL=https://66b1f8e71ca8ad33d4f5f63e.mockapi.io

4. Запустити dev сервер:

npm run dev

5. Відкрити в браузері:
   http://localhost:3000

   ***

## Виконав

Yurii Hnid — Frontend Developer

GitHub: https://github.com/Sensei8760

Email: gnid.yura@gmail.com
