const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Création des bookmakers
  const bookmakers = [
    { nom: 'Stake', code: 'STAKE', ordre: 1 },
    { nom: 'PS3838', code: 'PS3838', ordre: 2 },
    { nom: 'Winamax', code: 'WINA', ordre: 3 },
    { nom: 'Betclic', code: 'BETC', ordre: 4 },
    { nom: 'Paris Sportifs En Ligne', code: 'PSEL', ordre: 5 },
    { nom: 'Unibet', code: 'UNI', ordre: 6 },
  ]

  for (const bookmaker of bookmakers) {
    await prisma.bookmaker.upsert({
      where: { code: bookmaker.code },
      update: {},
      create: bookmaker,
    })
  }

  console.log('✅ Bookmakers créés avec succès !')
  
  // Initialiser la bankroll à 0
  const existingBankroll = await prisma.bankroll.findFirst()
  
  if (!existingBankroll) {
    await prisma.bankroll.create({
      data: {
        montant: 0,
        description: 'Initialisation de la bankroll'
      }
    })
    console.log('✅ Bankroll initialisée !')
  } else {
    console.log('ℹ️ Bankroll déjà existante')
  }
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })