const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const errorHandler = require("./app/helpers/error.handler");
const app = express();

const corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// global error handler
app.use(errorHandler);

const db = require("./app/models");
const Role = db.role;

db.mongoose
  .connect(`mongodb+srv://${dbConfig.HOST}:${dbConfig.PASSWORD}@cluster0.uevbubw.mongodb.net/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
  

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  try {
    const documentCount = await Role.estimatedDocumentCount();
    if (documentCount === 0) {
      await Role.insertMany(db.ROLES.map(name => ({ name })));
      console.log("added 'user', 'moderator', 'admin' to roles collection");
    }
  } catch (error) {
    console.log(error);
  }
}
