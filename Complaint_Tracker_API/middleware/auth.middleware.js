const auth = (req, res, next) => {

    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization header is required"
        });
    }
    console.log("Authorization header found:", authHeader);
    next();
};

export default auth;
