const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../controllers/authController");

const auth = (req, res, next) => {
  try {
    // Obtener el token del encabezado
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    // Formato esperado: "Bearer {token}"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({
          message: "Authentication token format invalid, access denied",
        });
    }

    // Verificar token
    const verified = jwt.verify(token, JWT_SECRET);

    // Añadir usuario a la solicitud
    req.user = verified;

    // Continuar con la siguiente función
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = auth;
