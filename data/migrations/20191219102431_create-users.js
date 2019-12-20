
exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments()

        tbl.string('username', 128)
        .unique()
        .notNullable()

        tbl.text('password')
        .notNullable()
    })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
};
