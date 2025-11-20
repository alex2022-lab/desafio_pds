import {Test, TestingModule} from "@nestjs/testing";
import {AppModule} from "../src/app.module";
import request from "supertest";
import {INestApplication} from "@nestjs/common";

describe("Ticket Management E2E Tests", () => {
  let ticketModule;
  let app: INestApplication;
  beforeAll(async () => {
    // Initialize application context, database connections, etc.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  })
  it("verify remaining tickets", () => {
    // Example test logic
    return request(app.getHttpServer()).get("/tickets").expect(200)
  })
})