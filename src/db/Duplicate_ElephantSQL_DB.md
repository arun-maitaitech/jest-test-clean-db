# spell-checker:ignore lzop rkqzpvy ozgjgvc psql

# (1) Download the last backup

# (2) Run to extract the SQL file from it:

lzop -x "rkqzpvy.2023-03-03T00_04_40+00_00.sql.lzo"

# (3) Edit the file like this:

# Rename DB name everywhere

# Comment out everything above the first

CREATE TYPE

# Comment out the following (bottom)

GRANT CREATE ON SCHEMA public TO ozgjgvc;
GRANT INSERT,UPDATE ON TABLE public.pg_stat_statements TO ozgjgvc;

# Add this to show progress

\echo 'Starting to insert into table X'
-- big pile of inserts go here...
\echo 'Finished inserting into table X'

# (4) Run the following to restore the data

cd /Users/u1/Downloads/Temp\(D\)\ -\ Delete/really\ del/1/9/1
cat "1.sql" | psql "postgres://ozgjgvc:In3Du0jRHphzarHPIKNv32@abal.db.elephantsql.com/ozgjgvc"

# (5) Consider splitting the SQL file to 2 files, so no query will time out
