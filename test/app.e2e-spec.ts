import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, LoggerService } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

class TestLogger implements LoggerService {
  log(message: string) {}
  error(message: string, trace: string) {}
  warn(message: string) {}
  debug(message: string) {}
  verbose(message: string) {}
}

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useLogger(new TestLogger())
    await app.init()

  })

  afterAll(async () => {
    await Promise.all([
      app.close(),
    ])
  })


  describe('Authentication', () => {
    let jwtToken: string

    describe('AuthModule', () => {
      it('authenticates user with valid credentials and provides a jwt token', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'nguyen', password: '123' })
          .expect(201)
        
        jwtToken = response.body.access_token
        expect(jwtToken).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/); 
      })

      it('fails to authenticate user with an incorrect password', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'nguyen', password: 'test' })
          .expect(401)

        expect(response.body.access_token).not.toBeDefined()
      })

     
      it('fails to authenticate user that does not exist', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send({ username: 'test', password: 'test' })
          .expect(500)

        expect(response.body.access_token).not.toBeDefined()
      })
    })

    describe('Protected', () => {
      it('gets protected resource with jwt authenticated request', async () => {

        const response = await request(app.getHttpServer())
          .get('/profile')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200)

        const data = response.body.data
        expect(data).not.toEqual(null); 
      })
    })
  })

})