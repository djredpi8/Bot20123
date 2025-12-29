# Watch Together Discord Bot

Бот создаёт invite-ссылку на официальную Discord Activity **Watch Together (YouTube)** в текущем voice-канале.

## Возможности

- Только slash-команды.
- `/yt start` — создаёт invite в voice-канале пользователя.
- `/yt help` — краткая справка.
- `/yt link <url>` — проверка ссылки youtube.com/youtu.be и подсказка для вставки в Watch Together.
- Проверки: команда только в guild, пользователь в voice-канале, права **Create Instant Invite**, cooldown 10 секунд.

## Требования

- Node.js 20+
- Discord.js v14+

## Быстрый старт (локально)

1. **Создай Discord Application** в [Discord Developer Portal](https://discord.com/developers/applications).
2. Во вкладке **Bot** нажми **Add Bot**.
3. Включи **Message Content Intent** не требуется (не используется), достаточно стандартных intents.
4. Скопируй **Bot Token**.
5. Скопируй **Client ID** приложения (в разделе **General Information**).
6. Создай `.env` по примеру:

```bash
cp .env.example .env
```

Заполни:

```
DISCORD_TOKEN=...
CLIENT_ID=...
```

7. Установи зависимости и запусти:

```bash
npm install
npm run dev
```

При старте бот зарегистрирует slash-команды глобально.

## Приглашение бота на сервер

Сгенерируй ссылку:

```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=1048576&scope=bot%20applications.commands
```

Разрешение `1048576` — **Create Instant Invite**. Убедись, что бот имеет это право в нужных voice-каналах.

## Команды

- `/yt start` — создать invite на Watch Together.
- `/yt help` — справка.
- `/yt link <url>` — проверка ссылки и подсказка.

## Сборка и запуск

```bash
npm run build
npm start
```

## Деплой

- Используй любой Node.js 20+ хостинг.
- Укажи переменные окружения `DISCORD_TOKEN` и `CLIENT_ID`.
- Запусти `npm run build` и `npm start`.

## Docker

```bash
docker compose up --build
```

Убедись, что файл `.env` находится рядом с `docker-compose.yml`.

## Важно

Бот **не** скачивает видео или аудио с YouTube. Он создаёт официальный invite на Discord Activity Watch Together.
