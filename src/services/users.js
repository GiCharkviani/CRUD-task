const knex = require('../knex');

const USERS_TABLE = 'users';
const RETURN_COLS = ['id', 'username', 'email', 'avatar', 'age', 'phone'];

module.exports = {
  addUser(user) {
    return knex(USERS_TABLE).insert(user).returning(RETURN_COLS);
  },
  getUserById(id) {
    return knex(USERS_TABLE).select(RETURN_COLS).where({ id }).first();
  },
  getUsers() {
    return knex(USERS_TABLE).select(RETURN_COLS);
  },
  updateUser(id, user) {
    return knex(USERS_TABLE)
      .update({
        username: user.username || null,
        email: user.email || null,
        avatar: user.avatar || null,
        age: user.age || null,
        phone: user.phone || null,
      })
      .where({ id })
      .returning(RETURN_COLS);
  },
  patchUser(id, user) {
    return knex(USERS_TABLE).update(user).where({ id }).returning(RETURN_COLS);
  },
  removeUser(id) {
    return knex(USERS_TABLE).where({ id }).del(RETURN_COLS);
  },
};
