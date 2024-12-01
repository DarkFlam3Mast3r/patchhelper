const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Request-With, Content-Type,Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE,PUT, OPTIONS"
  );
  next();
});

app.use((req, res, next) => {
  console.log("first middleware");
  next();
});

app.post("/ask-python", async (req, res) => {
  try {
    const { question } = req.body || "Delicious Candy";
    if (!question) {
      return res.status(400).send({ error: "No question provided" });
    }

    try {
      // Send request to Flask service running on localhost:5000 with a timeout of 15 seconds
      const response = await axios.post(
        "http://localhost:5000/ask",
        { question },
        {
          timeout: 15000, // Timeout set to 15 seconds (15000 ms)
        }
      );

      // Send the response from Flask back to the front-end
      res.send(response.data);
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        console.error("Request timed out");
        return res
          .status(408)
          .send({
            error: "Request timed out, Flask service did not respond in time",
          });
      }

      console.error("Error communicating with Flask:", error.message);
      res.status(500).send({ error: "Error communicating with Flask service" });
    }
  } catch (error) {
    if (error.message.includes("timed out")) {
      // 超时错误
      res.status(408).send({ error: error.message });
    } else {
      // 其他错误
      res.status(500).send({ error: error.message });
    }
  }
});
module.exports = app;
