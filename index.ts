import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errorHandler } from './app/helpers/error.handler';
import dotenv from 'dotenv';
import { db } from './app/models';
import { routes } from './app/routes';

dotenv.config();
const app: Express = express();
const corsOptions = { origin: process.env.BASE_URL };
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// global error handler
app.use(errorHandler);

const Role = db.role;

db.mongoose
  .connect(`mongodb+srv://${process.env.HOST}:${process.env.PASSWORD}@cluster0.uevbubw.mongodb.net/${process.env.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err: any) => {
    console.error("Connection error", err);
    process.exit();
  });
  

// routes
app.use("/api", routes);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

async function initial() {
  try {
    const documentCount = await Role.estimatedDocumentCount();
    if (documentCount === 0) {
      await Role.insertMany(db.ROLES.map((name: string) => ({ name })));
      console.log("added 'user', 'moderator', 'admin' to roles collection");
    }
  } catch (error) {
    console.log(error);
  }
}
