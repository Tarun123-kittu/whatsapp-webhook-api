// seed.js
const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/whatsShare?readPreference=primary&directConnection=true&ssl=false",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const seedData = [
  { email: 'DolomitesDream@gmail.com', password: 'admin1234' },
];

async function seed() {
  for (const userData of seedData) {
    const newUser = new User(userData);
    await newUser.save();
  }
  console.log('Seed data inserted');
  mongoose.connection.close();
}
seed();
