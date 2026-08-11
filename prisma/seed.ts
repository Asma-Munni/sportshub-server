// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

const prisma = new PrismaClient();

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

  // Create some products
  await prisma.product.createMany({
    data: [
      {
        name: "Pro Football",
        slug: "pro-football",
        description: "Premium leather football",
        price: new Decimal(79.99),
        stock: 15,
        image: "https://images.unsplash.com/photo-1560185127-6c658d8b48de?auto=format&fit=crop&w=800&q=80",
        status: "AVAILABLE",
        categoryId: football.id,
      },
      {
        name: "Air Basketball",
        slug: "air-basketball",
        description: "Indoor/outdoor basketball",
        price: new Decimal(49.5),
        stock: 8,
        image: "https://images.unsplash.com/photo-1608680516037-0def4dc39e49?auto=format&fit=crop&w=800&q=80",
        status: "AVAILABLE",
        categoryId: basketball.id,
      },
      {
        name: "Training Cones Set",
        slug: "training-cones",
        description: "Set of 10 orange cones",
        price: new Decimal(29.99),
        stock: 20,
        image: "https://images.unsplash.com/photo-1580842084756-c31f6953808b?auto=format&fit=crop&w=800&q=80",
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
