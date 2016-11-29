exports.up = (knex, Promise) => {
  return knex.schema.createTable('products', (table) => {
    table.increments();
    table.string('name').notNullable().unique();
    table.text('description').notNullable();
    table.float('price').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('products');
};
