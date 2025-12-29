// Use this BEFORE multer middleware in the route
export const validateEmailBeforeUpload = (req, res, next) => {
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.startsWith("multipart/form-data")) {
        return res.status(400).json({ error: "Invalid content type. Expected multipart/form-data." });
    }

    let emailFound = false;

    req.on("data", (chunk) => {
        const str = chunk.toString();
        if (str.includes('name="email"')) {
            emailFound = true;
        }
    });

    req.on("end", () => {
        if (!emailFound) {
            return res.status(400).json({ error: "Email is required in form-data before upload" });
        }
        next();
    });
};
