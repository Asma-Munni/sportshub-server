// prisma/seed.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create categories if not exist
  const football = await prisma.category.upsert({
    where: { slug: "football" },
    update: {},
    create: {
      name: "Football",
      slug: "football",
      description: "All football gear",
      status: "ACTIVE",
    },
  });

  const basketball = await prisma.category.upsert({
    where: { slug: "basketball" },
    update: {},
    create: {
      name: "Basketball",
      slug: "basketball",
      description: "Basketball equipment",
      status: "ACTIVE",
    },
  });

  const tennis = await prisma.category.upsert({
    where: { slug: "tennis" },
    update: {},
    create: {
      name: "Tennis",
      slug: "tennis",
      description: "Tennis equipment and accessories",
      status: "ACTIVE",
    },
  });

  const fitness = await prisma.category.upsert({
    where: { slug: "fitness" },
    update: {},
    create: {
      name: "Fitness",
      slug: "fitness",
      description: "Fitness and gym equipment",
      status: "ACTIVE",
    },
  });

  // Create some products
  await prisma.product.createMany({
    data: [
      {
        name: "Pro Football",
        slug: "pro-football",
        description: "Premium leather football for professional matches",
        price: 79.99,
        stock: 15,
        image: "https://images.unsplash.com/photo-1560185127-6c658d8b48de?auto=format&fit=crop&w=800&q=80",
        status: "AVAILABLE",
        categoryId: football.id,
      },
      {
        name: "Air Basketball",
        slug: "air-basketball",
        description: "Indoor/outdoor basketball with superior grip",
        price: 49.50,
        stock: 8,
        image: "https://images.unsplash.com/photo-1608680516037-0def4dc39e49?auto=format&fit=crop&w=800&q=80",
        status: "AVAILABLE",
        categoryId: basketball.id,
      },
      {
        name: "Training Cones Set",
        slug: "training-cones",
        description: "Set of 10 orange cones for agility training",
        price: 29.99,
        stock: 20,
        image: "https://images.unsplash.com/photo-1580842084756-c31f6953808b?auto=format&fit=crop&w=800&q=80",
        status: "AVAILABLE",
        categoryId: football.id,
      },
      {
        name: "Pro Tennis Racket",
        slug: "pro-tennis-racket",
        description: "Lightweight carbon fiber racket for competitive play",
        price: 189.99,
        stock: 6,
        image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80",
        status: "AVAILABLE",
        categoryId: tennis.id,
      },
      {
        name: "Resistance Bands Set",
        slug: "resistance-bands-set",
        description: "5-piece resistance bands for home and gym workouts",
        price: 24.99,
        stock: 30,
        image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=800&q=80",
        status: "AVAILABLE",
        categoryId: fitness.id,
      },
      {
        name: "Basketball Shoes Elite",
        slug: "basketball-shoes-elite",
        description: "High-performance basketball shoes with ankle support",
        price: 149.99,
        stock: 12,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        status: "AVAILABLE",
        categoryId: basketball.id,
      },
      {
        name: "Yoga Mat Premium",
        slug: "yoga-mat-premium",
        description: "Extra thick non-slip yoga mat for comfort and stability",
        price: 39.99,
        stock: 25,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80",
        status: "AVAILABLE",
        categoryId: fitness.id,
      },
      {
        name: "Football Goalkeeper Gloves",
        slug: "goalkeeper-gloves",
        description: "Professional grip goalkeeper gloves with wrist support",
        price: 59.99,
        stock: 10,
        image: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?auto=format&fit=crop&w=800&q=80",
        status: "AVAILABLE",
        categoryId: football.id,
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
