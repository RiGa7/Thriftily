import express from "express";

const router = express.Router();

router.get("/",(req,res)=>{res.send("List Saving goals")});

router.post("/",(req,res)=>{});

router.put("/:id",(req,res)=>{});

router.delete("/:id",(req,res)=>{});