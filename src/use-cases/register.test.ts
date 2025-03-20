import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/prisma/in-memory/in-memory-users-repositories'
import { UsersAlreadyExistsError } from '@/use-cases/erros/users-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'Alexandre',
      email: 'Alexandre@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'Alexandre',
      email: 'Alexandre@gmail.com',
      password: '123456',
    })

    const isPasswordHashed = await compare('123456', user.password_hash)
    expect(isPasswordHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'alexandre@gmail.com'

    await sut.execute({
      name: 'Alexandre',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'alexandre',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UsersAlreadyExistsError)
  })
})
