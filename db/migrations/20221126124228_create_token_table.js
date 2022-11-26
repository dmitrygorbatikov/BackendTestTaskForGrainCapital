/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('refreshToken', function (table){
            table.primary(['id']);
            table.increments('id')
            table.integer('user_id').unsigned().notNullable();
            table.string('token').notNullable();
            table.foreign('user_id').references('id').inTable('users');

        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('refreshToken')
};
