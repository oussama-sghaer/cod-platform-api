import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { default as request } from "supertest"
import { AppModule } from "../src/app.module"
import { PrismaService } from "../src/prisma/prisma.service"

describe("GET /me (e2e)", () => {
  let app: INestApplication

  beforeAll(async () => {
    process.env.AUTH_ADAPTER = "mock"
    process.env.MOCK_USER_ID = "00000000-0000-0000-0000-000000000002"

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
        $connect: jest.fn(),
        $disconnect: jest.fn(),
      })
      .compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it("returns OWNER context when x-mock-store-id header is set", async () => {
    const res = await request(app.getHttpServer())
      .get("/me")
      .set("x-mock-store-id", "00000000-0000-0000-0000-000000000001")

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      userId: "00000000-0000-0000-0000-000000000002",
      storeId: "00000000-0000-0000-0000-000000000001",
      role: "OWNER",
    })
  })

  it("returns 401 when header is absent", async () => {
    const res = await request(app.getHttpServer()).get("/me")
    expect(res.status).toBe(401)
  })
})
