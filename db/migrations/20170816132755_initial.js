
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('folders', function(jetfuel) {
      jetfuel.increments('id').primary();
      jetfuel.string('name').unique();

      jetfuel.timestamps(true, true);
    }),
    knex.schema.createTable('links', function(jetfuel) {
      jetfuel.increments('id').primary();
      jetfuel.string('name');
      jetfuel.string('orig_url');
      jetfuel.string('short_url');
      jetfuel.integer('folder_id').unsigned();
      jetfuel.foreign('folder_id')
        .references('folders.id');

      jetfuel.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('links'),
    knex.schema.dropTable('folders')
  ])
};
