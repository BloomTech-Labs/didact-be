const cleaner = require('knex-cleaner');
require('dotenv').config()
exports.seed = function(knex) {
    return cleaner.clean(knex, {
        mode: 'truncate', 
        ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
    });
};