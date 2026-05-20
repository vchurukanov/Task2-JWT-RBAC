# Task 2 — JWT Authentication and RBAC Authorization

## Опис проєкту

Цей проєкт реалізує базову систему автентифікації та авторизації на Node.js та Express з використанням JWT і RBAC.

У роботі реалізовано:

- `POST /login` — вхід користувача за email та password;
- генерацію JWT access-токена з полями `userId` та `role`;
- middleware `authenticate` для перевірки JWT;
- middleware `authorize(role)` для перевірки ролі користувача;
- захищений маршрут `GET /admin`, доступний лише користувачам з роллю `admin`;
- хешування паролів за допомогою `bcryptjs`.

Паролі не зберігаються у відкритому вигляді. Для перевірки пароля використовується bcrypt-хеш.

---

## Використані технології

- Node.js
- Express.js
- JSON Web Token
- bcryptjs
- dotenv
- Thunder Client / Postman для тестування API

---

## Структура проєкту

```text
Task2-JWT-RBAC
│
├── server.js
├── generate-hashes.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
