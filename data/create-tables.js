const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {
    try {
        // initiate connecting to db
        await client.connect();

        // run a query to create tables
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(256) UNIQUE NOT NULL,
                hash VARCHAR(512) NOT NULL
            );           
            CREATE TABLE categories (
                id SERIAL PRIMARY KEY NOT NULL,
                name VARCHAR(256) NOT NULL,
                icon VARCHAR(256) NOT NULL,
                background_color VARCHAR(256) NOT NULL,
                color VARCHAR(256) NOT NULL
            );
            CREATE TABLE listings (
                id SERIAL PRIMARY KEY NOT NULL,
                title VARCHAR(512) NOT NULL,
                images text[] NOT NULL,
                price NUMERIC(10,2) NOT NULL,
                latitude NUMERIC(10,7) NOT NULL,
                longitude NUMERIC(10,7) NOT NULL,
                category_id INTEGER REFERENCES categories(id) NOT NULL,
                user_id INTEGER REFERENCES users(id) NOT NULL
            );
            CREATE TABLE messages (
                id SERIAL PRIMARY KEY NOT NULL,
                from_user_id INTEGER REFERENCES users(id) NOT NULL,
                to_user_id INTEGER REFERENCES users(id) NOT NULL,
                listing_id INTEGER REFERENCES listings(id) NOT NULL,
                body TEXT NOT NULL,
                created_at BIGINT NOT NULL DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)
            );
        `);

        console.log(
            'create tables complete',
            getEmoji(),
            getEmoji(),
            getEmoji()
        );
    } catch (err) {
        // problem? let's see the error...
        console.log(err);
    } finally {
        // success or failure, need to close the db connection
        client.end();
    }
}
