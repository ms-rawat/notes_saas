const express = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/',auth,async(req,res)=>{
    try{
        console.log(req.user)
        const {user_id} = req.user;

        const query = `
        select * from menus m join role_menus rm on rm.menu_id = m.menu_id
        join users u on u.role_id = rm.role_id
        where u.id = $1 and m.is_active = true
        order by  m.parent_id, m.order_no;
        `

        const {rows} = await pool.query(query, [user_id]);

        res.json({
            success : true,
            data : rows
        })
    }catch(err)
    {
        console.log(err)
        res.status(500).json({error:err.message})
    }
})

module.exports = router