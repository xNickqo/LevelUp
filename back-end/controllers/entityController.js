const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const dbPath = path.join(__dirname, "../db");

// Helper function to get the data file path based on table parameter
const getDataPath = (table = "data") => {
  return path.join(dbPath, `${table}.json`);
};

// Helper function to read data from the JSON file
const readData = (table) => {
  const dataPath = getDataPath(table);
  try {
    if (!fs.existsSync(dataPath)) {
      // If file doesn't exist, create it with empty entities array
      writeData({ entities: [] }, table);
      return { entities: [] };
    }
    const data = fs.readFileSync(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading data from ${dataPath}:`, error);
    return { entities: [] };
  }
};

// Helper function to write data to the JSON file
const writeData = (data, table) => {
  const dataPath = getDataPath(table);
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Error writing data to ${dataPath}:`, error);
    return false;
  }
};

// Get all entities
exports.getAllEntities = (req, res) => {
  const table = req.query.table || "data";
  const data = readData(table);
  res.json(data.entities);
};

// Get entity by ID
exports.getEntityById = (req, res) => {
  const { id } = req.params;
  const table = req.query.table || "data";
  const data = readData(table);

  const entity = data.entities.find((e) => e.id === id);

  if (!entity) {
    return res.status(404).json({ message: "Entity not found" });
  }

  res.json(entity);
};

// Create new entity
exports.createEntity = (req, res) => {
  const table = req.query.table || "data";
  const data = readData(table);
  const newEntity = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  data.entities.push(newEntity);

  if (writeData(data, table)) {
    res.status(201).json(newEntity);
  } else {
    res.status(500).json({ message: "Failed to create entity" });
  }
};

// Update entity
exports.updateEntity = (req, res) => {
  const { id } = req.params;
  const table = req.query.table || "data";
  const data = readData(table);

  const entityIndex = data.entities.findIndex((e) => e.id === id);

  if (entityIndex === -1) {
    return res.status(404).json({ message: "Entity not found" });
  }

  const updatedEntity = {
    ...data.entities[entityIndex],
    ...req.body,
    id, // Ensure ID remains the same
    updatedAt: new Date().toISOString(),
  };

  data.entities[entityIndex] = updatedEntity;

  if (writeData(data, table)) {
    res.json(updatedEntity);
  } else {
    res.status(500).json({ message: "Failed to update entity" });
  }
};

// Delete entity
exports.deleteEntity = (req, res) => {
  const { id } = req.params;
  const table = req.query.table || "data";
  const data = readData(table);

  const entityIndex = data.entities.findIndex((e) => e.id === id);

  if (entityIndex === -1) {
    return res.status(404).json({ message: "Entity not found" });
  }

  data.entities.splice(entityIndex, 1);

  if (writeData(data, table)) {
    res.json({ message: "Entity deleted successfully" });
  } else {
    res.status(500).json({ message: "Failed to delete entity" });
  }
};

// Get paginated entities with filtering and sorting
exports.getPaginatedEntities = (req, res) => {
  const table = req.query.table || "data";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortField = req.query.sortField || "createdAt";
  const sortOrder = req.query.sortOrder || "desc";
  const searchTerm = req.query.search || "";

  const data = readData(table);
  let filteredEntities = [...data.entities];

  // Filter entities if search term is provided
  if (searchTerm) {
    filteredEntities = filteredEntities.filter((entity) => {
      // Check all properties of the entity for the search term
      return Object.values(entity).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (value !== null && typeof value === "object") {
          // For nested objects, convert to string and search
          return JSON.stringify(value)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        } else if (value !== null && value !== undefined) {
          // For numbers, booleans, etc., convert to string
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
    });
  }

  // Sort entities
  filteredEntities.sort((a, b) => {
    const valueA = a[sortField] !== undefined ? a[sortField] : "";
    const valueB = b[sortField] !== undefined ? b[sortField] : "";

    if (typeof valueA === "string" && typeof valueB === "string") {
      if (sortOrder.toLowerCase() === "asc") {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    } else {
      if (sortOrder.toLowerCase() === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    }
  });

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedEntities = filteredEntities.slice(startIndex, endIndex);

  // Prepare response with pagination metadata
  const response = {
    entities: paginatedEntities,
    pagination: {
      total: filteredEntities.length,
      page,
      limit,
      totalPages: Math.ceil(filteredEntities.length / limit),
      hasNextPage: endIndex < filteredEntities.length,
      hasPrevPage: startIndex > 0,
    },
    filter: {
      search: searchTerm,
    },
    sort: {
      field: sortField,
      order: sortOrder,
    },
  };

  res.json(response);
};
