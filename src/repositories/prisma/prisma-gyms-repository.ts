import { prisma } from '@/lib/prisma'
import { GymsRepository } from '../gyms-repository'
import { Gym } from '@prisma/client'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async create(data: { title: string; latitude: number; longitude: number }) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return gyms
  }

  async findManyNearby({
    latitude,
    longitude,
  }: {
    latitude: number
    longitude: number
  }) {
    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * FROM gyms
    WHERE (6371 * acos(cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) + sin(radians(${latitude})) * sin(radians(latitude)))) <= 10
    `
    return gyms
  }
}
