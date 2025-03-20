import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/prisma/in-memory/in-memory-users-repositories'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './erros/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'Alexandre',
      email: 'alexandretest@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'alexandretest@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'aalexandretest@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await expect(() =>
      sut.execute({
        email: 'aalexandretest@gmail.com',
        password: '123455',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
