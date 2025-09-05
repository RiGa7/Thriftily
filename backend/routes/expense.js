import express from "express";

const router = express.Router();

router.get("/",(req, res)=>{
    res.send("List Expenses");
})

router.post("/",(req,res)=>{});

router.put("/:id",(req,res)=>{});
router.delete("/:id",(req,res)=>{});

export default router;