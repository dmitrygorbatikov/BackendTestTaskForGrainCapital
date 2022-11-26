/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('topics', function (table){
            table.primary(['id']);
            table.increments('id');
            table.integer('user_id').unsigned().notNullable();
            table.string('title').notNullable();
            table.string('text').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.string('description').notNullable();
            table.foreign('user_id').references('id').inTable('users');
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('topics')
};
