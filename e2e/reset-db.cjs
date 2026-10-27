// Resets the isolated e2e database: catalogue, promo codes and one existing
// customer with an email + password. Never point this at the dev database.
const path = require('path')
const backend = path.join(__dirname, '../../backend/src')
const mongoose = require(require.resolve('mongoose', { paths: [backend] }))
const { seedCatalogue } = require(path.join(backend, 'utils/seedCatalogue'))
const PromoCode = require(path.join(backend, 'models/PromoCode'))
const User = require(path.join(backend, 'models/User'))

const uri = process.env.MONGODB_URI
if (!uri || !uri.endsWith('_e2e')) throw new Error(`Refusing to reset non-e2e database: ${uri}`)

async function resetDb() {
  await mongoose.connect(uri)
  await mongoose.connection.dropDatabase()
  await seedCatalogue()
  await PromoCode.insertMany([
    { code: 'WELCOME10', type: 'Percent', value: 10, minOrderValue: 0, usageLimit: 1000 },
    { code: 'FREESHIP', type: 'Shipping', value: 0, minOrderValue: 0, usageLimit: 500 },
  ])
  await User.create({
    name: 'Existing Customer',
    email: 'existing@example.com',
    password: 'Secret@123',
    phone: '9000000001',
    phoneVerified: true,
  })
  await mongoose.disconnect()
}

if (require.main === module) {
  resetDb().then(() => console.log('e2e database reset'), (err) => { console.error(err); process.exit(1) })
}
module.exports = { resetDb }
