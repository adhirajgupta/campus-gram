import { SQLDatabase } from "encore.dev/storage/sqldb";

export const universityDB = new SQLDatabase("university", {
  migrations: "./migrations",
});
