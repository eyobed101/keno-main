import express from 'express';
import { Draw } from '../controllers/Draw.Controller.js';

const router = express.Router();


router.post("/draw", Draw);

export default router