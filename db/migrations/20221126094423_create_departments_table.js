/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('departments', function (table){
            table.primary(['id']);
            table.increments('id')
            table.integer('admin_id').notNullable();
            table.string('office').notNullable();
            table.string('IT').notNullable();
        })
};

/**
 * @param { import("knex").Knex } knex
 * @returns {Knex.SchemaBuilder}
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('departments')
};
