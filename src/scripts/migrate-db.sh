#!/bin/bash

# migrate database - provides export and import functionalities for postgres database

# pg_dump/pg_restore must be >= the server's major version. Homebrew's default
# postgresql keg can lag behind the server, so prefer the highest-versioned
# postgresql@<N> keg installed (e.g. postgresql@15) before falling back to PATH.
NEWEST_PG_KEG=$(ls -d /opt/homebrew/opt/postgresql@*/bin /usr/local/opt/postgresql@*/bin 2>/dev/null | sort -t@ -k2 -n | tail -1)
if [ -n "$NEWEST_PG_KEG" ]; then
  PATH="$NEWEST_PG_KEG:$PATH"
fi

# dotenv psql connection variables
DB_USER=$(grep POSTGRES_USER .env | cut -d '=' -f2)
DB_PASSWORD=$(grep POSTGRES_PASSWORD .env | cut -d '=' -f2)
DB_HOST=$(grep POSTGRES_HOST .env | cut -d '=' -f2)
DB_PORT=$(grep POSTGRES_PORT .env | cut -d '=' -f2)
DB_NAME=$(grep POSTGRES_DB .env | cut -d '=' -f2)


# export database
export_db() {
  echo "Exporting database..."
  # use password from .env file for pg_dump
  export PGPASSWORD="$DB_PASSWORD"
  EXPORT_FILE="data/${DB_NAME}_$(date +%Y%m%d_%H%M%S).dump"
  mkdir -p data
  # pass password to pg_dump using PGPASSWORD environment variable
  pg_dump -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -F c -b -v -f "$EXPORT_FILE" "$DB_NAME"
  if [ $? -ne 0 ]; then
    echo "Database export failed"
    exit 1
  fi
  echo "Database exported to $EXPORT_FILE"
}

# import database
import_db() {
  IMPORT_FILE="$1"
  if [ -z "$IMPORT_FILE" ]; then
    echo "Usage: $0 import <dump-file>"
    exit 1
  fi
  if [ ! -f "$IMPORT_FILE" ]; then
    echo "Import file not found: $IMPORT_FILE"
    exit 1
  fi
  echo "Importing database..."
  export PGPASSWORD="$DB_PASSWORD"
  pg_restore -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -v "$IMPORT_FILE"
  if [ $? -ne 0 ]; then
    echo "Database import failed"
    exit 1
  fi
  echo "Database imported from $IMPORT_FILE"
}

# check command line arguments
if [ "$1" == "export" ]; then
  export_db
elif [ "$1" == "import" ]; then
  import_db "$2"
else
  echo "Usage: $0 {export|import <dump-file>}"
  exit 1
fi

