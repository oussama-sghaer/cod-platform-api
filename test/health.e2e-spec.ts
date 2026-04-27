import { Test, TestingModule } from "@nestjs/testing"
import { INestApplication } from "@nestjs/common"
import { default as request } from "supertest"
import { AppModule } from "../src/app.module"
import { PrismaService } from "../src/prisma/prisma.service"

process.env.AUTH_ADAPTER = "mock"
process.env.MOCK_USER_ID = "00000000-0000-0000-0000-000000000002"

describe("GET /health (e2e)", () => {
  let app: INestApplication

  beforeAll(async () => {
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

  it("returns 200 with the right shape", async () => {
    const res = await request(app.getHttpServer()).get("/health")
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      status: "ok",
      service: "cod-platform-api",
    })
    expect(res.body.version).toBeDefined()
    expect(res.body.timestamp).toBeDefined()
  })
})
