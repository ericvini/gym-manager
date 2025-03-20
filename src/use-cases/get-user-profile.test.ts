import { beforeEach, describe, expect, it } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/prisma/in-memory/in-memory-users-repositories'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './erros/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: 'Alexandre',
      email: 'alexandretest@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual('Alexandre')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: '123456',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
