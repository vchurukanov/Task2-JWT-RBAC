require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env");
}

// У реальному проєкті користувачі зберігаються в базі даних.
// У цій навчальній роботі використовується масив користувачів.
// Паролі не зберігаються у відкритому вигляді — тільки bcrypt-хеші.
const users = [
  {
    id: 1,
    email: process.env.ADMIN_EMAIL,
    passwordHash: process.env.ADMIN_PASSWORD_HASH,
    role: "admin",
  },
  {
    id: 2,
    email: process.env.USER_EMAIL,
    passwordHash: process.env.USER_PASSWORD_HASH,
    role: "user",
  },
];

// Відкритий тестовий маршрут
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Task 2 JWT + RBAC API is running",
  });
});

// POST /login
// Приймає { email, password }
// Перевіряє користувача та повертає JWT з userId і role.
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = users.find((item) => item.email === email);

    if (!user || !user.passwordHash) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    return res.status(200).json({
      message: "Login successful",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
});

// Middleware authenticate
// Перевіряє наявність і валідність JWT у заголовку:
// Authorization: Bearer <token>
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authorization header is missing",
    });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      message: "Invalid authorization format. Use: Bearer <token>",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// Middleware authorize(role)
// Перевіряє, чи має користувач потрібну роль.
function authorize(requiredRole) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        message: "User is not authenticated",
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    next();
  };
}

// Захищений маршрут.
// Доступний тільки користувачам із роллю admin.
app.get("/admin", authenticate, authorize("admin"), (req, res) => {
  res.status(200).json({
    message: "Welcome to the admin panel",
    user: req.user,
  });
});

// Додатковий захищений маршрут для перевірки звичайного токена.
// Він не обов'язковий за завданням, але корисний для демонстрації.
app.get("/profile", authenticate, (req, res) => {
  res.status(200).json({
    message: "User profile",
    user: req.user,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});