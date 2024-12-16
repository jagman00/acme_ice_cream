require("dotenv").config();
const client = require('./client');
const express = require("express");
const app = express();
client.connect();
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
    const {flavor_name, is_favorite} = req.body;
    //console.log(flavor_name, is_favorite);
    const {id} = req.params;
    try {
        const SQL = /*SQL*/`
        UPDATE flavors
        SET flavor_name = $1, is_favorite=$2, updated_at=now()
        WHERE id = $3
        RETURNING *
        `;
        const response = await client.query(SQL, [flavor_name, is_favorite, id])
        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));
    