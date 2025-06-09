const fs = require("fs");
const path = require("path");

// Path to the tematicas data file
const tematicasDataPath = path.join(__dirname, "../db/tematicas.json");

// Helper function to read tematicas data
const readTematicasData = () => {
  try {
    const data = fs.readFileSync(tematicasDataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tematicas data:", error);
    return { tematicas: [] };
  }
};

// Get all tematicas
exports.getAllTematicas = (req, res) => {
  const data = readTematicasData();
  res.json(data.tematicas);
};

// Get tematica by ID
exports.getTematicaById = (req, res) => {
  const { id } = req.params;
  const data = readTematicasData();

  const tematica = data.tematicas.find((t) => t.id === id);

  if (!tematica) {
    return res.status(404).json({ message: "Tematica not found" });
  }

  res.json(tematica);
};

// Search tematicas by name
exports.searchTematicas = (req, res) => {
  const { query } = req.query;
  const data = readTematicasData();

  if (!query) {
    return res.json(data.tematicas);
  }

  const lowercaseQuery = query.toLowerCase();
  const filteredTematicas = data.tematicas.filter(
    (tematica) => tematica.nombre.toLowerCase().includes(lowercaseQuery)
  );

  res.json(filteredTematicas);
};
