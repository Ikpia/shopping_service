const ProductService = require("../services/product-service");
const { CustomerEvents, ShoppingEvents } = require("../utils");
const UserAuth = require("./middlewares/auth");

module.exports = (app) => {
    const service = new ProductService();
    const customerService = new CustomerService();

    app.post("/product/create", async (req, res, next) => {
        try {
            const {
                name,
                desc,
                type,
                unit,
                price,
                available,
                suplier,
                banner,
            } = req.body;
            // validation
            const { data } = await service.CreateProduct({
                name,
                desc,
                type,
                unit,
                price,
                available,
                suplier,
                banner,
            });
            return res.json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get("/category/:type", async (req, res, next) => {
        const type = req.params.type;

        try {
            const { data } = await service.GetProductsByCategory(type);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });

    app.get("/:id", async (req, res, next) => {
        const productId = req.params.id;

        try {
            const { data } = await service.GetProductDescription(productId);
            return res.status(200).json(data);
        } catch (err) {
            next(err);
        }
    });

    app.post("/ids", async (req, res, next) => {
        try {
            const { ids } = req.body;
            const products = await service.GetSelectedProducts(ids);
            return res.status(200).json(products);
        } catch (err) {
            next(err);
        }
    });

    app.put("/wishlist", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const { payload } = service.GetProductPayload(
            _id,
            { productId: req.body._id },
            "ADD_TO_WISHLIST"
        );
        try {
            await CustomerEvents(payload);
            return res.status(200).json(payload.data.product);
        } catch (err) {
            next(err);
        }
    });

    app.delete("/wishlist/:id", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const productId = req.params.id;
        const { payload } = service.GetProductPayload(
            _id,
            { productId },
            "REMOVE_FROM_WISHLIST"
        );

        try {
            await CustomerEvents(payload);
            return res.status(200).json(payload.data.product);
        } catch (err) {
            next(err);
        }
    });

    app.put("/cart", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const { productId, qty } = req.body;
        const { result } = await service.GetProductPayload(
            _id,
            { productId, qty },
            "ADD_TO_CART"
        );
        try {
            await CustomerEvents(result);
            await ShoppingEvents(result);
            return res.status(200).json({
                product: result.data.product,
                unit: result.data.qty,
            });
        } catch (err) {
            next(err);
        }
    });

    app.delete("/cart/:id", UserAuth, async (req, res, next) => {
        const { _id } = req.user;
        const { id } = req.params;
        const { result } = await service.GetProductPayload(
            _id,
            { productId: id },
            "REMOVE_FROM_CART"
        );
        try {
            await CustomerEvents(result);
            await ShoppingEvents(result);
            return res.status(200).json({
                product: result.data.product,
                unit: result.data.qty,
            });
        } catch (err) {
            next(err);
        }
    });

    //get Top products and category
    app.get("/", async (req, res, next) => {
        //check validation
        try {
            const { data } = await service.GetProducts();
            return res.status(200).json(data);
        } catch (error) {
            next(err);
        }
    });
};
