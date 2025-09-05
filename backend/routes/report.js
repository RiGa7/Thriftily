import express from "express";

const router = express.Router();

router.get("/monthly",(req,res)=>{
    res.send("report");
});

export default router;