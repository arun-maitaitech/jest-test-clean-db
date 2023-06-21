Generate a new migration file with the last changes (replace "<NAME>" with the name you want to give these changes, example: "FirstInit", "AddingTableX", etc.):
`npm run typeORM_generate_a_new_migration_file -- "<NAME>"`
Example:
`npm run typeORM_generate_a_new_migration_file -- "FirstInit"`

Apply all migration files on the DB's schema:
`npm run typeORM_run_migrations`

Revert last migration file (revert all doesn't exists):
`npm run typeORM_revert`

Export/Backup

pg_dump -U username -h localhost database_name >> sql_file.sql
