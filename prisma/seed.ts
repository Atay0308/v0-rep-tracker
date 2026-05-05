import { prisma } from "./prisma"

async function main() {
  const groups = [
    "Bauch",
    "Beine",
    "Bizeps",
    "Brust",
    "Nacken",
    "Rücken",
    "Schultern",
    "Trizeps"
  ]

  for (const name of groups) {
    await prisma.muscle.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
}

main()
  .then(() => {
    console.log("Seeding done")
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })