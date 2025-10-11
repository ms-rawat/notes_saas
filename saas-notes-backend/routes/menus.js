const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/',auth,async(req,res)=>{
    try{
        const {userId} = req.user;

        const query = `
       select m.* from users u
       join role_menus as rm on rm.role_id = u.role_id
       JOIN menus m on rm.menu_id = m.menu_id
       where u.id = $1
       order by  m.parent_id, m.order_no;
        `

        const {rows} = await pool.query(query, [userId]);

        res.json({
            success : true,
            data : rows
        })
    }catch(err)
    {
        res.status(500).json({error:err.message})
    }
})

module.exports = router