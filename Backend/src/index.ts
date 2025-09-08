import dotenv from "dotenv";
import app from "./app";

import dbConnection from "./dbConnection/connection";

dotenv.config();

const PORT = process.env.PORT || 3000;

dbConnection().then(() => {
  app.listen(PORT, () => {

});
});



