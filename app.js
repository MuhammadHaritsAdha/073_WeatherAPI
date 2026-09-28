const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi", async (req, res) => {
    const kota = req.query.kota || "jakarta";
    const apiKey = "TmW3n2IbOKaZxkghOoYB";
    
    const url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apiKey}`;
    
    try {
        const response = await axios.get(url);
        const feature = response.data.features[0];

        const longitude = feature.geometry.coordinates[0];
        const latitude = feature.geometry.coordinates[1];

        const kecamatan = feature.text;

        let provinsi = "-";
        let negara = "-";

        if (feature.context) {
            feature.context.forEach(item => {
                if (item.id.includes("region") || item.id.includes("province")) {
                    provinsi = item.text;
                }
                if (item.id.includes("country")) {
                    negara = item.text;
                }
            });
        }

        res.json({
            negara: negara,
            provinsi: provinsi,
            kecamatan: kecamatan,
            longitude: longitude,
            latitude: latitude
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gagal mengambil data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});