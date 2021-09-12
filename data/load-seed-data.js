const bcrypt = require('bcryptjs');
const client = require('../lib/client');
// import our seed data:
const seedListings = require('./listings.js');
const seedCategories = require('./categories.js');
const seedMessages = require('./messages.js');
const seedUsers = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
run();

async function run() {
    try {
        await client.connect();

        await Promise.all(
            seedUsers.map((user) => {
                const hash = bcrypt.hashSync(user.password, 8);
                return client.query(
                    `
                      INSERT INTO users (name, email, hash)
                      VALUES ($1, $2, $3)
                      RETURNING *;
                  `,
                    [user.name, user.email, hash]
                );
            })
        );

        await Promise.all(
            seedCategories.map((category) => {
                const { name, icon, backgroundColor, color } = category;
                return client.query(
                    `
                    INSERT INTO categories (
                        name,
                        icon,
                        background_color,
                        color
                    )
                    VALUES ($1, $2, $3, $4);
                `,
                    [name, icon, backgroundColor, color]
                );
            })
        );

        await Promise.all(
            seedListings.map((listing) => {
                const { title, images, price, categoryId, userId, location } =
                    listing;
                return client.query(
                    `
                    INSERT INTO listings (
                        title,
                        images,
                        price,
                        category_id,
                        user_id,
                        latitude,
                        longitude
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
                    [
                        title,
                        images,
                        price,
                        categoryId,
                        userId,
                        location.latitude,
                        location.longitude,
                    ]
                );
            })
        );

        await Promise.all(
            seedMessages.map((message) => {
                const { fromUserId, toUserId, listingId, content, dateTime } =
                    message;
                return client.query(
                    `
                    INSERT INTO messages (
                        from_user_id,
                        to_user_id,
                        listing_id,
                        body,
                        created_at
                    )
                    VALUES ($1, $2, $3, $4, $5);
                `,
                    [fromUserId, toUserId, listingId, content, dateTime]
                );
            })
        );

        console.log(
            'seed data load complete',
            getEmoji(),
            getEmoji(),
            getEmoji()
        );
    } catch (err) {
        console.log(err);
    } finally {
        client.end();
    }
}
