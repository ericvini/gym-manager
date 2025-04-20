import { app } from '@/app'
import { afterAll, beforeAll, expect, it } from 'vitest'
import request from 'supertest'
import { describe } from 'node:test'
import { createAndAuthenticateUser } from '@/use-cases/utils/create-and-authenticate-user'

describe('Create Gym (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Gym 01',
        description: 'Gym 01 description',
        phone: '11999999999',
        latitude: -23.123456,
        longitude: -46.123456,
      })

    expect(response.statusCode).toEqual(201)
  })
})
