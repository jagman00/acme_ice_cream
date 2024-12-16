const client = require('./client')

const init = async() => {
    await client.connect()
    console.log('connected to database');

    let SQL = /*SQL*/`
    DROP TABLE IF EXISTS flavors;
        CREATE TABLE flavors(
            id SERIAL PRIMARY KEY,
            flavor_name VARCHAR(255) NOT NULL,
            is_favorite BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now()
        )`;
    await client.query(SQL);
    console.log('table created');
    
    SQL = /*SQL*/`
        INSERT INTO flavors(flavor_name, is_favorite) VALUES('chocolate', true);
        INSERT INTO flavors(flavor_name) VALUES('vanilla');
        INSERT INTO flavors(flavor_name) VALUES('strawberry');
    `;

    await client.query(SQL);
    console.log('data seeded');
    client.end();
 
};
init();