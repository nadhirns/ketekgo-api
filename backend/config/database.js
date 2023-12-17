import { Sequelize } from "sequelize";

const db = new Sequelize("ketekgo", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

export default db;
