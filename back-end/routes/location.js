const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");

/**
 * @swagger
 * /location/countries:
 *   get:
 *     summary: Get all countries
 *     description: Retrieve a list of all countries with their ISO codes
 *     tags:
 *       - Location
 *     responses:
 *       200:
 *         description: A list of countries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   isoCode:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/countries", locationController.getCountries);

/**
 * @swagger
 * /location/communities:
 *   get:
 *     summary: Get all autonomous communities
 *     description: Retrieve a list of all Spanish autonomous communities
 *     tags:
 *       - Location
 *     responses:
 *       200:
 *         description: A list of autonomous communities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/communities", locationController.getCommunities);

/**
 * @swagger
 * /location/provinces/{communityId}:
 *   get:
 *     summary: Get provinces by community ID
 *     description: Retrieve a list of provinces that belong to a specific autonomous community
 *     tags:
 *       - Location
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the autonomous community
 *     responses:
 *       200:
 *         description: A list of provinces in the specified community
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   communityId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Bad request - missing community ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  "/provinces/:communityId",
  locationController.getProvincesByCommunity
);

module.exports = router;
