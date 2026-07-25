import express from "express";
import { searchPexelsVideo } from "../services/pexelsService";

const router = express.Router();

router.get("/video", async (req, res) => {

    const query = req.query.query as string;

    const video = await searchPexelsVideo(query);

    res.json({
        success: true,
        video
    });

});

export default router;