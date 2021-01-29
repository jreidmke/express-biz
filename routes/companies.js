const express = require('express');
const router = express.Router();
const db = require('./../db');

router.get('/', async(req, res, next) => {
    try {
        const results = await db.query(
            `SELECT *
            FROM companies`
        );
        res.json(results.rows);
    } catch (error) {
        return next(error);
    }
})

router.get('/:code', async(req, res, next) => {
    try {
        const comResults = await db.query(
            `SELECT *
            FROM companies
            WHERE code='${req.params.code}'`
        );
        const inResults = await db.query(
            `SELECT *
            FROM invoices
            WHERE comp_code=$1`,
            [req.params.code]
        );
        const display = comResults.rows[0];
        display['invoices'] = inResults.rows;
        res.json(display);
    } catch (error) {
        return next(error);
    }
})

router.post('/', async(req, res, next) => {
    try {
        const {code, name, description} = req.body;
        const results = await db.query(
            `INSERT INTO companies (code, name, description)
            VALUES($1, $2, $3)
            RETURNING code, name, description`,
            [code, name, description]
        );
        return res.json(results.rows);
    } catch (error) {
        return next(error);
    }
})

router.put('/:code', async(req, res, next) => {
    try {
        const {name, description} = req.body;
        const {code} = req.params;
        const results = await db.query(
            `UPDATE companies
            SET name=$1, description=$2
            WHERE code=$3
            RETURNING code, name, description`, 
            [name, description, code]
        )
        return res.json({company: results.rows[0]});
    } catch (error) {
        return next(error)
    }
})

router.delete('/:code', async(req, res, next) => {
    try {
        await db.query(
            `DELETE FROM companies WHERE code='${req.params.code}'`
        )
        return res.json({message: "DELETED"})
    } catch (error) {
        return next(error)
    }
})

module.exports = router; 