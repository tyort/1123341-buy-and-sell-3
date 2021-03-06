'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const {HttpCode, API_PREFIX} = require(`../../constants`);
const routes = require(`../api`);
const {getLogger} = require(`../lib/logger`);

// Значение может быть любым в пределах от 0 до 65535
// но лучше не использовать диапазон от 0 до 1023
// не использовать список зарегестрированных в IANA
const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const app = express();
app.use(express.json());

// в консольном выводе (в объекте) при вызове методов логгера будет ключ name со значением `api`
const logger = getLogger({name: `api`});

app.use((req, res, next) => {
  logger.debug(`Запрос по адресу ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });
  next();
});

app.use(API_PREFIX, routes);

app.get(`/offers`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);

  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
  }
});

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .send(`Not found`);
  logger.error(`Маршрут не найден: ${req.url}`);
});

app.use((err, _req, _res, _next) => {
  logger.error(`Ошибка при обработке запроса: ${err.message}`);
});

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`Произошла ошибка при создании сервера: ${err.message}`);
        }

        return logger.info(`Listening to connections on ${port}`);
      });

    } catch (err) {
      logger.error(`Произошла ошибка: ${err.message}`);
      process.exit(1);
    }
  }
};
