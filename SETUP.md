# Setup i Uruchamianie

## Wymagania
- Docker i Docker Compose
- Git

## Szybki start

1. **Sklonuj repozytorium** (jeśli jeszcze nie masz):
```bash
git clone <repo_url>
cd WdAI
```

2. **Uruchom aplikację**:
```bash
docker-compose up -d
```

3. **Czekaj na inicjalizację**:
- PostgreSQL: ~1 sekunda
- Backend: ~2 sekundy
- Frontend: ~2 sekundy

4. **Dostęp do aplikacji**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- PostgreSQL: localhost:5432

## Testowy użytkownik

```
Username: testuser
Email: test@example.com
Password: password123
```

## API Endpoints

### Autentykacja
- `POST /api/auth/register` - Rejestracja nowego użytkownika
- `POST /api/auth/login` - Zalogowanie

### Projekty (wymagana autentykacja - Bearer token)
- `GET /api/projects` - Pobierz projekty użytkownika
- `GET /api/projects/:id` - Pobierz szczegóły projektu
- `POST /api/projects` - Utwórz nowy projekt
- `PUT /api/projects/:id` - Zaktualizuj projekt
- `DELETE /api/projects/:id` - Usuń projekt

## Struktura projektu

```
WdAI/
├── backend/
│   ├── src/
│   │   ├── index.js                 # Główny plik
│   │   ├── db.js                    # Połączenie do bazy
│   │   ├── routes/
│   │   │   └── index.js             # Routing
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   └── projectController.js # Projects logic
│   │   ├── services/
│   │   │   ├── userService.js       # User DB operations
│   │   │   ├── tokenService.js      # JWT handling
│   │   │   └── projectService.js    # Project DB operations
│   │   └── middleware/
│   │       └── authMiddleware.js    # JWT verification
│   ├── init.sql                     # Inicjalizacja bazy
│   ├── package.json
│   ├── .dockerignore
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                  # Main component
│   │   ├── main.jsx                 # Entry point
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Auth.css
│   │   │   └── Dashboard.css
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state
│   │   └── api/
│   │       ├── apiClient.js         # Axios config
│   │       └── authApi.js           # API methods
│   ├── package.json
│   ├── .dockerignore
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
└── notes.md
```

## Zmienne środowiskowe

### Backend (.env)
```
DATABASE_URL=postgres://user:password@host:port/dbname
JWT_SECRET=your-secret-key
PORT=3000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## Polecenia útilne

### Wyświetl logi
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Wejdź do bazy danych
```bash
docker exec -it postgres psql -U postgres -d appdb
```

### Rebuild i restart
```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## Features aktualnie zaimplementowane

- ✅ Rejestracja użytkowników
- ✅ Logowanie z JWT
- ✅ Zarządzanie projektami (CRUD)
- ✅ Lista projektów użytkownika
- ✅ Responsywny UI

## Features w trakcie/planowane

- ⏳ Notatki do projektów
- ⏳ Tagi i etykiety
- ⏳ Zagnieżdżone notatki (parent-child)
- ⏳ Drag & drop dla notatek
- ⏳ Sketches/Galeria zdjęć
- ⏳ Sharing projektów
