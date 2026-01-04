const express = require('express');
const axios = require('axios');
const app = express();

// Cổng cho Render hoặc Local
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('API TikTok Downloader đang chạy!');
});

app.get('/api/tiktok', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "Vui lòng nhập link url" });

    try {
        // Sử dụng Source của TikWM (khá ổn định và miễn phí)
        const response = await axios.get(`https://www.tikwm.com/api/?url=${videoUrl}`);
        const data = response.data.data;

        if (!data) throw new Error("Không lấy được dữ liệu");

        res.json({
            status: "success",
            title: data.title,
            cover: `https://www.tikwm.com${data.cover}`,
            video_no_watermark: `https://www.tikwm.com${data.play}`,
            music: `https://www.tikwm.com${data.music}`,
            author: data.author.nickname
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi khi tải video", message: error.message });
    }
});

app.listen(PORT, () => console.log(`Server chạy tại port ${PORT}`));