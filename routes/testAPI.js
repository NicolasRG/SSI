const app = require("express");
var router = app.Router();

router.use((req,res, next)=>{
    console.log("test API route was called so lets see what happes :)");
    console.log( req.app.get('socketio'));
    let io = req.app.get('socketio');
    next();
})

router.get('/', (req,res)=>{
    res.send({msg:"testapi get"});
    ;});

router.post('/', (req,res, ...d)=>{
    res.send({msg:"testapi post"});
    ;});



module.exports = router;