'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const DataService = require(`../data-service/category`);
const {HttpCode} = require(`../../constants`);

const mockData = [
  {
    "id": `pkptwo`,
    "category": [`Игры`],
    "description": `Продаю с болью в сердце... Таких предложений больше нет! Забирай бесплатно! Такой только у меня и у Майкла Джексона.`,
    "picture": `item16.jpg`,
    "title": `Продам журналы`,
    "type": `SALE`,
    "sum": 15830,
    "comments": [
      {"id": `o-jh-X`, "text": `А где блок питания?`},
      {
        "id": `D--sw5`,
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {"id": `vGXyQt`, "text": `Совсем немного... А где блок питания?`},
      {
        "id": `IvjsiB`,
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `9KV6dw`,
        "text": `Почему в таком ужасном состоянии? А сколько игр в комплекте? Оплата наличными или перевод на карту?`
      },
      {
        "id": `knJyi7`,
        "text": `А где блок питания? Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "id": `LWw1EH`,
    "category": [`Оружие`],
    "description": `Даю недельную гарантию. Если найдёте дешевле — сброшу цену. Это настоящая находка для коллекционера! Пользовались бережно и только по большим праздникам.`,
    "picture": `item06.jpg`,
    "title": `Продам новую приставку Sony Playstation 5`,
    "type": `OFFER`,
    "sum": 1319,
    "comments": [
      {"id": `XcLu2f`, "text": `Оплата наличными или перевод на карту?`}
    ]
  },
  {
    "id": `Dru6O9`,
    "category": [`Журналы`],
    "description": `Не хочется продавать, но придется... Забирай бесплатно! Продаю с болью в сердце... Такой только у меня и у Майкла Джексона.`,
    "picture": `item12.jpg`,
    "title": `Куплю породистого кота`,
    "type": `OFFER`,
    "sum": 63447,
    "comments": [
      {
        "id": `BEtjnJ`,
        "text": `Вы что?! В магазине дешевле. Совсем немного...`
      },
      {"id": `cLmcgR`, "text": `Совсем немного... Неплохо, но дорого.`},
      {"id": `WctnHe`, "text": `Неплохо, но дорого.`}
    ]
  },
  {
    "id": `WxbLaj`,
    "category": [`Игры`],
    "description": `Пользовались бережно и только по большим праздникам. Не хочется продавать, но придется... Даю недельную гарантию. Это настоящая находка для коллекционера!`,
    "picture": `item03.jpg`,
    "title": `Продам строительный мусор`,
    "type": `SALE`,
    "sum": 56370,
    "comments": [{"id": `fAujmz`, "text": `Вы что?! В магазине дешевле.`}]
  },
  {
    "id": `xz9vz8`,
    "category": [`Журналы`],
    "description": `Если товар не понравится — верну всё до последней копейки. Если найдёте дешевле — сброшу цену. Пользовались бережно и только по большим праздникам. Такой только у меня и у Майкла Джексона.`,
    "picture": `item05.jpg`,
    "title": `Куплю породистого кота`,
    "type": `SALE`,
    "sum": 85141,
    "comments": [
      {"id": `BVNib5`, "text": `Оплата наличными или перевод на карту?`},
      {
        "id": `1zhP5G`,
        "text": `А сколько игр в комплекте? Продаю в связи с переездом. Отрываю от сердца. Совсем немного...`
      },
      {
        "id": `MhthsY`,
        "text": `Вы что?! В магазине дешевле. Почему в таком ужасном состоянии?`
      },
      {"id": `C4t1_Q`, "text": `Совсем немного...`},
      {
        "id": `B0vLZC`,
        "text": `Неплохо, но дорого. Совсем немного... Продаю в связи с переездом. Отрываю от сердца.`
      }
    ]
  },
  {
    "id": `eQfiJR`,
    "category": [`Посуда`],
    "description": `Бонусом отдам все аксессуары. Не хочется продавать, но придется... Получишь коньки в подарок. Пользовались бережно и только по большим праздникам.`,
    "picture": `item16.jpg`,
    "title": `Куплю породистого кота`,
    "type": `OFFER`,
    "sum": 43914,
    "comments": [
      {
        "id": `oaDZCM`,
        "text": `Оплата наличными или перевод на карту? Почему в таком ужасном состоянии?`
      },
      {
        "id": `_VOmFw`,
        "text": `Совсем немного... Продаю в связи с переездом. Отрываю от сердца. Почему в таком ужасном состоянии?`
      },
      {"id": `K3bXtz`, "text": `Почему в таком ужасном состоянии?`}
    ]
  },
  {
    "id": `8IuFiT`,
    "category": [`Антиквариат`],
    "description": `Таких предложений больше нет! Если найдёте дешевле — сброшу цену. Бонусом отдам все аксессуары. Такой только у меня и у Майкла Джексона.`,
    "picture": `item01.jpg`,
    "title": `Продам отличную подборку фильмов на VHS`,
    "type": `SALE`,
    "sum": 28943,
    "comments": [{"id": `wCTi8p`, "text": `Неплохо, но дорого.`}]
  },
  {
    "id": `4aDNej`,
    "category": [`Животные`],
    "description": `Хочешь изменить жизнь? Тогда бери - не думай! Продаю с болью в сердце... Даю недельную гарантию. Таких предложений больше нет!`,
    "picture": `item15.jpg`,
    "title": `Куплю что-нибудь съедобное`,
    "type": `SALE`,
    "sum": 93968,
    "comments": [
      {
        "id": `bwrv0r`,
        "text": `А где блок питания? Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `XFXQM4`,
        "text": `Совсем немного... Оплата наличными или перевод на карту? Неплохо, но дорого.`
      },
      {
        "id": `4ThG6u`,
        "text": `Неплохо, но дорого. А сколько игр в комплекте? Почему в таком ужасном состоянии?`
      },
      {
        "id": `yuudU0`,
        "text": `С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?`
      },
      {"id": `snrgyA`, "text": `Неплохо, но дорого. А где блок питания?`}
    ]
  },
  {
    "id": `WH4JDn`,
    "category": [`Лекарства`],
    "description": `Забирай бесплатно! Такой только у меня и у Майкла Джексона. Пользовались бережно и только по большим праздникам. Хочешь изменить жизнь? Тогда бери - не думай!`,
    "picture": `item04.jpg`,
    "title": `Продам журналы`,
    "type": `OFFER`,
    "sum": 39315,
    "comments": [
      {
        "id": `EjCTVT`,
        "text": `Почему в таком ужасном состоянии? Продаю в связи с переездом. Отрываю от сердца. Неплохо, но дорого.`
      },
      {
        "id": `wGsg5n`,
        "text": `Продаю в связи с переездом. Отрываю от сердца.`
      },
      {"id": `SQ9Lzc`, "text": `Вы что?! В магазине дешевле.`},
      {"id": `BFFmr2`, "text": `Неплохо, но дорого.`},
      {
        "id": `3A835H`,
        "text": `Оплата наличными или перевод на карту? Продаю в связи с переездом. Отрываю от сердца.`
      },
      {
        "id": `9u8EQY`,
        "text": `Неплохо, но дорого. Оплата наличными или перевод на карту?`
      }
    ]
  },
  {
    "id": `5xd3ZQ`,
    "category": [`Лекарства`],
    "description": `Это настоящая находка для коллекционера! Хочешь изменить жизнь? Тогда бери - не думай! Продаю с болью в сердце... Даю недельную гарантию.`,
    "picture": `item11.jpg`,
    "title": `Продам плиту`,
    "type": `OFFER`,
    "sum": 28693,
    "comments": [
      {
        "id": `Vh6SB0`,
        "text": `Совсем немного... Вы что?! В магазине дешевле.`
      }
    ]
  }
];

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  // позволяет выполнить асинхронную операцию до того,
  // как будет запущен какой-либо из тестов в блоке.
  beforeAll(async () => {
    // Выполнием тестовый запрос к API
    // Сохраняем результат в response.
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 7 categories`, () => expect(response.body.length).toBe(7));
  test(`Category names are "Игры", "Журналы", "Посуда", "Антиквариат", "Животные", "Лекарства", "Оружие"`,
      () => expect(response.body).toEqual(
          expect.arrayContaining([`Игры`, `Журналы`, `Посуда`, `Антиквариат`, `Животные`, `Лекарства`, `Оружие`])
      )
  );
});
