const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Création des bookmakers
  const bookmakers = [
    { nom: 'Stake', couleur: '#8B00FF' },
    { nom: 'PS3838', couleur: '#FF6B00' },
    { nom: 'Winamax', couleur: '#000000' },
    { nom: 'Betclic', couleur: '#FF0000' },
    { nom: 'Paris Sportifs En Ligne', couleur: '#0066CC' },
    { nom: 'Unibet', couleur: '#14805E' },
  ]

  for (const bookmaker of bookmakers) {
    await prisma.bookmaker.upsert({
      where: { nom: bookmaker.nom },
      update: {},
      create: bookmaker,
    })
  }

  console.log('✅ Bookmakers créés avec succès !')
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })