# Проект
Это монорепо `экспресс` сервер + `тг` бот + `svelte` фронт

`nodejs` `esbuild` `typescript` `typeorm` `postgresql` `telegram bot api`
`svelte` `vite`
## Скрипты
Установка зависимойстей
```bash
npm install
```
* зависимости установятся для вложеного проекта `svelte` тоже

Создать сборку
```bash
npm run build
```
* создаст сборку всего сайта в `/build` директорию, в `/build/static` будет лежать сборка svelte

Режим разработки
```bash
npm run start:dev:server

npm run start:dev:client
```
* `start:dev:server`- server в режиме разработки
* `start:dev:client`- client в режиме разработки

## Environment
можно использовать `.env` файл в корне проекта или запускать команду `node build.js` с аргументами
```bash
APP_PORT=80
DB_TYPE=postgres
DB_HOST=example
DB_PORT=5432
DB_USER=example
DB_PASSWORD=example
DB_DATABASE=example
TG_BOT_TOKEN=my_token
```