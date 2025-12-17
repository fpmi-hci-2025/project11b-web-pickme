```markdown
# PickMe Frontend

Фронтенд для социальной сети PickMe.

## Технологии

- React 18
- React Router 6
- Tailwind CSS
- Vite
- Axios

## Локальный запуск

### С Docker

```bash
docker-compose up -d
# Приложение доступно на http://localhost:3000
```

### Без Docker

```bash
# Установить зависимости
npm install

# Создать .env
cp .env.example .env
# Указать VITE_API_URL

# Запустить dev сервер
npm run dev
```

## Сборка

```bash
npm run build
```

## Тестирование

```bash
npm run test
npm run test:coverage
```
