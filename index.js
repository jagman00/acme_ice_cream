require("dotenv").config();
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
const express = require("express");
const app = express();

app.use(express.json());
app.use(require('morgan')('dev'));

//get flavors route
app.get('/api/flavors', async (req, res, next) => {
    try {
        const SQL = /*SQL*/`
        SELECT * from flavors ORDER BY created_at DESC
        `;
        const response = await client.query(SQL)
        res.send(response.rows);
    } catch (error) {
        next(error)
    }
})

//get flavors:id route
app.get('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = /*SQL*/`
        SELECT * FROM flavors
        WHERE id = $1
        `;
        const response = await client.query(SQL, [req.params.id])
        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

//post flavors route
app.post('/api/flavors', async (req, res, next) => {
    try{
        const SQL = /*SQL*/`
        INSERT INTO flavors(flavor_name, is_favorite) VALUES($1, $2) RETURNING *
        `;
        const response = await client.query(SQL, [req.body.flavor_name, req.body.is_favorite])
        res.status(201).send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

//delete flavors:id route
app.delete('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = /*SQL*/`
        DELETE FROM flavors
        WHERE id = $1
        `;
        await client.query(SQL, [req.params.id])
        res.sendStatus(204)
    } catch (error) {
        next(error)
    }
})


//put flavors:id route
app.put('/api/flavors/:id', async (req, res, next) => {
    try {
        const SQL = /*SQL*/`
        UPDATE flavors
        SET flavor_name = $1, ranking=$2, updated_at=now()
        WHERE id = $3
        RETURNING *
        `;
        const response = await client.query(SQL, [req.body.txt, req.body.is_favorite, req.params.id])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})


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

    const port = process.env.PORT;
    app.listen(port, () => console.log(`listening on port ${port}`));
    
};
init();