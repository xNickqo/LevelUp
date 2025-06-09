const fs = require("fs");
const path = require("path");

// Path to data files
const countriesPath = path.join(__dirname, "../db/countries.json");
const communitiesPath = path.join(__dirname, "../db/communities.json");
const provincesPath = path.join(__dirname, "../db/provinces.json");

// Helper to read JSON data
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

// Get all countries
exports.getCountries = (req, res) => {
  try {
    const data = readJsonFile(countriesPath);

    if (!data) {
      return res.status(500).json({ message: "Error reading countries data" });
    }

    res.json(data.countries);
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all autonomous communities
exports.getCommunities = (req, res) => {
  try {
    const data = readJsonFile(communitiesPath);

    if (!data) {
      return res
        .status(500)
        .json({ message: "Error reading communities data" });
    }

    res.json(data.communities);
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get provinces by community ID
exports.getProvincesByCommunity = (req, res) => {
  try {
    const { communityId } = req.params;

    if (!communityId) {
      return res.status(400).json({ message: "Community ID is required" });
    }

    const data = readJsonFile(provincesPath);

    if (!data) {
      return res.status(500).json({ message: "Error reading provinces data" });
    }

    const filteredProvinces = data.provinces.filter(
      (province) => province.communityId === communityId
    );

    res.json(filteredProvinces);
  } catch (error) {
    console.error("Error fetching provinces:", error);
    res.status(500).json({ message: "Server error" });
  }
};
