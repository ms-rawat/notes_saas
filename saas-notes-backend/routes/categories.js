const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();


router.get('/',async(req,res)=>{
    try{
        const {rows} = await pool.query(`select * from categories`)
        res.json({
            success : true,
            data : rows
        })


    }catch(error)
    {
        res.status(500).json({error:error.message})
    }
})
module.exports = router