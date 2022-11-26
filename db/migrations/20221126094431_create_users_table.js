/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('users', function (table){
            table.primary(['id']);
            table.increments('id');
            table.integer('department_id').unsigned().notNullable();
            table.string('login').notNullable().unique();
            table.string('name').notNullable();
            table.string('surname').notNullable();
            table.string('password').notNullable();
            table.string('role').notNullable();
            table.string('position').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.foreign('department_id').references('id').inTable('departments')

        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('users')
};
