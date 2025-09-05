import {neon} from "@neondatabase/serverless"; 
// This line imports the neon function from the @neondatabase/serverless package. This function is used to establish a connection to a Neon database.
import dotenv from "dotenv"; //Node.js module used to load environment variables from a .env file into process.env.

dotenv.config();

const {PGUSER,PGPASSWORD,PGDATABASE,PGHOST} = process.env; //process.env is a global object in Node.js. It is a simple key-value object that contains all the environment variables from the environment where the Node.js process was started.

// <---- Connection ---->
export const sql = neon(`postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`);
// This line creates a connection to the PostgreSQL database using the neon function. The connection string is constructed using environment variables for the username, password, host, and database name. The resulting sql object can be used to interact with the database.

// sslmode=require ensures that the connection to the database is encrypted using SSL.
// channel_binding=require adds an additional layer of security by ensuring that the client and server are properly authenticated during the SSL handshake.

