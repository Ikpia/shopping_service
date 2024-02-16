const ProductService = require("../services/product-service");

module.exports = (app) => {
    app.post("/api-event", async (req, res, next) => {
        const { payload } = req.body;
        console.log("Hi from the product api-event");
        return res.status(200).json(payload);
    });
};
