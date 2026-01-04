const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('API TikTok Downloader đang chạy!'));

app.get('/api/tiktok', async (req, res) => {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).json({ error: "Thiếu link TikTok" });

    try {
        const response = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`);
        const d = response.data.data;

        if (!d) return res.status(500).json({ error: "Không lấy được dữ liệu video" });

        // FIX LỖI ENOTFOUND: Kiểm tra link trả về có phải link tuyệt đối không
        const fixUrl = (path) => {
            if (!path) return "";
            if (path.startsWith('http')) return path; 
            return `https://www.tikwm.com${path}`;
        };

        res.json({
            status: "success",
            title: d.title || "Video TikTok",
            video_no_watermark: fixUrl(d.play),
            music: fixUrl(d.music),
            author: d.author.nickname || "Unknown"
        });
    } catch (error) {
        res.status(500).json({ error: "Lỗi Server API", message: error.message });
    }
});

app.listen(PORT, () => console.log(`API chạy tại port ${PORT}`));
