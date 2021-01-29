const express = require('express');
const router = express.Router();
const db = require('./../db');

router.get('/', async(req, res, next) => {
    try {
        const results = await db.query(
            `SELECT * FROM invoices`
        );
        return res.json(results.rows);
    } catch (error) {
        return next(error);
    }
})

router.get('/:id', async(req, res, next) => {
    try {
        const results = await db.query(
            `SELECT * FROM invoices WHERE id='${req.params.id}'`
        )
        return res.json(results.rows);
    } catch (error) {
        return next(error);
    }
})

router.post('/', async(req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query(
            `INSERT INTO invoices(comp_code, amt)
            VALUES($1, $2)
            RETURNING *`,
            [comp_code, amt]
        );
        return res.json(results.rows[0]);
    } catch (error) {
        return next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const {amt} = req.body;
        const {id} = req.params;
        const results = await db.query(
            `UPDATE invoices
            SET amt=$1
            WHERE id=$2
            RETURNING *`,
            [amt, id]
        );
        return res.json(results.rows[0]);
    } catch (error) {
        return next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    try {
        await db.query(`DELETE FROM invoices WHERE id='${req.params.id}'`);
        return res.json({ message: "DELETED" })
    } catch (error) {
        return next(error);
    }
})

// Also, one route from the previous part should be updated:

// GET /companies/[code]
// Return obj of company: {company: {code, name, description, invoices: [id, ...]}}

// If the company given cannot be found, this should return a 404 status response.


module.exports = router; 
