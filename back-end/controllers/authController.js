const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const admin = require('firebase-admin');
const usersPath = path.join(__dirname, "../db/users.json");
const JWT_SECRET = "your-secret-key"; // En producción, usar variables de entorno


// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require("../angular-auth-51a73-firebase-adminsdk-fbsvc-e8861dd281.json");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

exports.firebaseLogin = async (req, res) => {
  const { idToken } = req.body;
  console.log("🧾 ID Token recibido:", idToken);
  if (!idToken) return res.status(400).json({ message: 'Missing ID token' });

  try {
    // Verificar token con Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    const data = readUsers();
    let user = data.users.find((u) => u.email === email);
    if (!user) {
      user = {
        id: uuidv4(),
        name: name || email.split('@')[0],
        email,
        password: null, // sin contraseña porque es login con Google
        role: 'user',
        isoCode: '',
        communityId: '',
        provinceId: '',
        createdAt: new Date().toISOString(),
      };
      data.users.push(user);
      writeUsers(data);
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    const { password, ...userWithoutPassword } = user;

    res.json({
      message: 'Login with Firebase successful',
      user: userWithoutPassword,
      token,
    });
    console.log(res.json);
  } catch (error) {
    console.error('❌ Firebase login error:', error);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};

// Helper para leer usuarios
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users:", error);
    return { users: [] };
  }
};

// Helper para escribir usuarios
const writeUsers = (data) => {
  try {
    fs.writeFileSync(usersPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing users:", error);
    return false;
  }
};

// Registrar un nuevo usuario
exports.signup = async (req, res) => {
  try {

    const { email, password, name, role, isoCode, communityId, provinceId } =
      req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    if (!isoCode) {
      return res.status(400).json({ message: "Country ISO code is required" });
    }

    if (!communityId) {
      return res.status(400).json({ message: "Community ID is required" });
    }

    if (!provinceId) {
      return res.status(400).json({ message: "Province ID is required" });
    }

    const data = readUsers();

    // Verificar si el usuario ya existe
    const existingUser = data.users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Asignar rol
    let finalRole = 'user';
    if (typeof role === 'string' && role.toLowerCase() === 'admin') {
      finalRole = 'admin';
    }

    // Crear nuevo usuario
    const newUser = {
      id: uuidv4(),
      name: name || email.split("@")[0],
      email,
      password: hashedPassword,
      role: finalRole,
      isoCode,
      communityId,
      provinceId,
      createdAt: new Date().toISOString(),
    };

    data.users.push(newUser);

    if (writeUsers(data)) {
      // Crear y devolver token
      const token = jwt.sign(
        { 
          userId: newUser.id, 
          email: newUser.email,
          role: newUser.role
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // No devolver la contraseña
      const { password, ...userWithoutPassword } = newUser;

      res.status(201).json({
        message: "User registered successfully",
        user: userWithoutPassword,
        token,
      });
    } else {
      res.status(500).json({ message: "Failed to register user" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Iniciar sesión
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const data = readUsers();

    // Buscar usuario
    const user = data.users.find((user) => user.email === email);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Crear y devolver token
    const token = jwt.sign(
      { userId: user.id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: "24h", }
      );

    // No devolver la contraseña
    const { password: pwd, ...userWithoutPassword } = user;

    res.json({
      message: "User logged in successfully",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Obtener todos los usuarios (sin contraseñas)
exports.getUsers = (req, res) => {
  try {
    const data = readUsers();
    const usersWithoutPasswords = data.users.map(({ password, ...user }) => user);
    res.json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error("Error getting users:", error);
    res.status(500).json({ message: "Failed to load users" });
  }
};

// Para uso en middleware de autenticación
exports.JWT_SECRET = JWT_SECRET;
