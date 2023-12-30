import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
app.use(express.static("public"));

app.use(bodyParser.json());
const API_KEY = "openuv-kflrlqqepscg-io";

app.get('/', (req,res) => {
    res.render("index.ejs", {uvValue: "Waiting for data...", advice: "Waiting for data.."});
})

app.post('/api/send-location', async(req, res) => {
    const { latitude, longitude } = req.body;
    
    // Handle the received location data on the server side
    // console.log('Received Location:', { latitude, longitude });
    let uvValue = "";
    let advice = "";

    // You can perform any server-side logic here
    try {
        const response = await axios.get(`https://api.openuv.io/api/v1/uv?lat=${latitude}&lng=${longitude}`, {
            headers: {
                'x-access-token': API_KEY,
                'Content-Type': 'application/json',
            },
        });
        uvValue = response.data.result.uv;
        
        if(uvValue<=2) {
            advice = "You can safely enjoy being outside!";
        } else if (uvValue>2 && uvValue<8) {
            advice = "Seek shade during midday hours! Slip on a shirt, slop on sunscreen and slap on hat!";
        } else {
            advice = "Avoid being outside during midday hours! Make sure you seek shade! Shirt, sunscreen and hat are a must!";
        }
        
        console.log(uvValue, advice);
        res.json({ uvValue, advice });
        
    } catch (error) {
        
        res.json({uvValue: error.message, advice: error.message});
    }

    // Send a response back to the client if needed
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
