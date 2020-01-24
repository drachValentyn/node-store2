const createCollection = async (db) => {
  await db.createCollection('all-users', {
    validator: {
      $and: [
        { _id: { $type: 'binData' } },
        { name: { $type: 'string' } },
        { login: { $type: 'string' } },
        { email: { $type: 'string' } },
        { date: { $type: 'date' } },
      ],
    },
    validationAction: 'error',
    validationLevel: 'strict',
  })
};

module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    try {
      const col = await db.listCollections({ name: 'users' }).toArray();
      if(col.length > 0) {
        throw new Error('Collection users already exists in MongoDb. Exited...')
      } else {
        await createCollection(db)
      }
    } catch(err) {
      throw err
    }
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    try {
      await db.dropCollection('all-users')
    } catch(err) {
      throw err
    }  }
};
