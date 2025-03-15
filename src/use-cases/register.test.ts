import { describe, expect, it } from "vitest"
import { RegisterUseCase } from "./register"
import { compare } from "bcryptjs"
import { InMemoryUsersRepository } from "@/repositories/in-memory-users-repositories"
import { UsersAlreadyExistsError } from "./users-already-exists-error"


describe('register Use Case', () => {

  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'Alexandre',
      email: 'Alexandre@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  }),

    it('should hash user password upon registration', async () => {
      const usersRepository = new InMemoryUsersRepository()
      const registerUseCase = new RegisterUseCase(usersRepository)

      const { user } = await registerUseCase.execute({
        name: 'Alexandre',
        email: 'Alexandre@gmail.com',
        password: '123456',
      })

      const isPasswordHashed = await compare('123456', user.password_hash)
      expect(isPasswordHashed).toBe(true)

    })


  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const email = 'alexandre@gmail.com'

    await registerUseCase.execute({
      name: 'Alexandre',
      email,
      password: '123456',
    })

    await expect(() => registerUseCase.execute(
      {
        name: 'alexandre',
        email,
        password: '123456'
      }
    )).rejects.toBeInstanceOf(UsersAlreadyExistsError)

  })

})
