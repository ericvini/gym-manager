import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repositories'
import { UsersAlreadyExistsError } from '@/use-cases/users-already-exists-error'


export async function register(req: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(req.body)

  try {

    const usersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    await registerUseCase.execute({ name, email, password })

  } catch (error) {
    if (error instanceof UsersAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }


    throw error

  }

  return reply.status(201).send()

}
