const CustomerService = require("../services/customer-service");

module.exports = (app) => {
    app.use("/api-events", async (req, res, next) => {
        const service = await new CustomerService();
        const payload = await service.SubscribeEvents(req.body);
        console.log(payload);
    });
};
