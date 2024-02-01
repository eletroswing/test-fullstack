import Dotenv from "dotenv";
import state from "./../src/adapters/state";
import city from "./../src/adapters/city";
import page from "./../src/adapters/page";

if (process.env.NODE_ENV !== "PRODUCTION") {
  Dotenv.config();
}

const API_URL = `http://localhost:${process.env.PORT}`;

beforeAll(async () => {
  await state.deleteAll();

  await state.createState("Teste", "ts");

  await city.createCity("ts", "city 1.1", "ct_1.1");
  await city.createCity("ts", "city 1.2", "ct_1.2");

  await state.createState("Teste 2", "ts2");

  await city.createCity("ts2", "city 2.1", "ct_2.1");
  await city.createCity("ts2", "city 2.2", "ct_2.2");

  await page.updateArticles("ts2", "ct_2.2", [
    {
      created_at: new Date().toISOString(),
      image: "base64",
      slug: "post_1",
      title: "title",
      text: "content",
    },
  ]);
});

afterAll(async () => {
  await state.deleteAll();
});

describe("Public routes", () => {
  test("Get States", async () => {
    const response = await fetch(`${API_URL}/public`);
    const responseJson = await response.json();

    expect(response.status).toBe(200);
    expect(responseJson).toEqual({
      states: [
        { state: "Teste", state_id: "ts" },
        { state: "Teste 2", state_id: "ts2" },
      ],
    });
  });

  test("Get Unique State", async () => {
    const response = await fetch(`${API_URL}/public/ts`);
    const responseJson = await response.json();

    expect(response.status).toBe(200);
    expect(responseJson).toEqual({
      cities: [
        { city: "city 1.1", city_id: "ct_1.1" },
        { city: "city 1.2", city_id: "ct_1.2" },
      ],
    });
  });

  test("Get Unique State - Bad request", async () => {
    const response = await fetch(`${API_URL}/public/tksddskns`);
    const responseJson = await response.json();

    expect(response.status).toBe(404);
    expect(responseJson).toEqual({
      statusCode: 404,
      message: "Requested resoure doest exists.",
    });
  });

  test("Get Unique Page", async () => {
    const response = await fetch(`${API_URL}/public/ts2/ct_2.2`);
    const responseJson = await response.json();

    expect(response.status).toBe(200);
    expect(responseJson).toEqual({
        zips: '',
        header: expect.any(Object),
        articles: [
          {
            title: 'title',
            text: 'content',
            created_at: expect.any(String),
            slug: 'post_1',
            image: 'base64',
            _id: expect.any(String)
          }
        ],
        faq: [],
        reviews: [],
        embedded_videos: [],
        attorney: []
      });
  });

  test("Get Unique Page - BadRequest", async () => {
    const response = await fetch(`${API_URL}/public/ts/ladsasndkasndka`);
    const responseJson = await response.json();

    expect(response.status).toBe(404);
    expect(responseJson).toEqual({
        statusCode: 404,
        message: "Requested resoure doest exists.",
      });
  });

  test("Get Unique Slug", async () => {
    const response = await fetch(`${API_URL}/public/ts2/ct_2.2/post_1`);
    const responseJson = await response.json();

    expect(response.status).toBe(200);
    expect(responseJson).toEqual({
        title: 'title',
        text: 'content',
        created_at: expect.any(String),
        slug: 'post_1',
        image: 'base64',
        _id: expect.any(String),
      });
  });

  test("Get Unique Slug - Bad Request", async () => {
    const response = await fetch(`${API_URL}/public/ts2/ct_2.2/dkasdnasndn`);
    const responseJson = await response.json();

    expect(response.status).toBe(404);
    expect(responseJson).toEqual({
      statusCode: 404,
      message: "Requested resoure doest exists.",
    });
  });
});
