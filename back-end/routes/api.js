const express = require("express");
const router = express.Router();
const entityController = require("../controllers/entityController");
const commonController = require("../controllers/commonController");
const auth = require("../middleware/auth");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Entity
 *     description: Operations related to entities management
 *   - name: Common
 *     description: Common utilities and reference data
 */

/**
 * @swagger
 * /api/entities:
 *   get:
 *     summary: Get all entities
 *     description: Retrieve a list of all entities stored in the database
 *     tags: [Entity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: table
 *         required: false
 *         description: Table/collection name to use (defaults to 'data')
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of entities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entity'
 *       401:
 *         description: Authentication error
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
router.get("/entities", auth, entityController.getAllEntities);

/**
 * @swagger
 * /api/entities/{id}:
 *   get:
 *     summary: Get an entity by ID
 *     description: Retrieve a specific entity by its ID
 *     tags: [Entity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the entity
 *         schema:
 *           type: string
 *       - in: query
 *         name: table
 *         required: false
 *         description: Table/collection name to use (defaults to 'data')
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested entity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entity'
 *       401:
 *         description: Authentication error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Entity not found
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
router.get("/entities/:id", auth, entityController.getEntityById);

/**
 * @swagger
 * /api/entities:
 *   post:
 *     summary: Create a new entity
 *     description: Create a new entity with the provided data
 *     tags: [Entity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: table
 *         required: false
 *         description: Table/collection name to use (defaults to 'data')
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Example Entity"
 *               description: "This is an example entity"
 *               status: "active"
 *     responses:
 *       201:
 *         description: Entity created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entity'
 *       401:
 *         description: Authentication error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to create entity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/entities", auth, entityController.createEntity);

/**
 * @swagger
 * /api/entities/{id}:
 *   put:
 *     summary: Update an entity
 *     description: Update an existing entity with the provided data
 *     tags: [Entity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the entity to update
 *         schema:
 *           type: string
 *       - in: query
 *         name: table
 *         required: false
 *         description: Table/collection name to use (defaults to 'data')
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Updated Entity"
 *               status: "inactive"
 *     responses:
 *       200:
 *         description: Entity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Entity'
 *       401:
 *         description: Authentication error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to update entity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/entities/:id", auth, entityController.updateEntity);

/**
 * @swagger
 * /api/entities/{id}:
 *   delete:
 *     summary: Delete an entity
 *     description: Delete an entity by its ID
 *     tags: [Entity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique ID of the entity to delete
 *         schema:
 *           type: string
 *       - in: query
 *         name: table
 *         required: false
 *         description: Table/collection name to use (defaults to 'data')
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entity deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Entity deleted successfully"
 *       401:
 *         description: Authentication error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Entity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to delete entity
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/entities/:id", auth, entityController.deleteEntity);

/**
 * @swagger
 * /api/paginated-entities:
 *   get:
 *     summary: Get paginated entities with filtering and sorting
 *     description: Retrieve entities with pagination, sorting, and text search capabilities
 *     tags: [Entity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: table
 *         required: false
 *         description: Table/collection name to use (defaults to 'data')
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number (defaults to 1)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of items per page (defaults to 10)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortField
 *         required: false
 *         description: Field to sort by (defaults to 'createdAt')
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         required: false
 *         description: Sort order ('asc' or 'desc', defaults to 'desc')
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: search
 *         required: false
 *         description: Search term to filter entities (will search in all text properties)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Paginated list of entities with metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 entities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Entity'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 42
 *                     page:
 *                       type: integer
 *                       example: 2
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       example: true
 *                 filter:
 *                   type: object
 *                   properties:
 *                     search:
 *                       type: string
 *                       example: "searchterm"
 *                 sort:
 *                   type: object
 *                   properties:
 *                     field:
 *                       type: string
 *                       example: "name"
 *                     order:
 *                       type: string
 *                       example: "asc"
 *       401:
 *         description: Authentication error
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
router.get("/paginated-entities", auth, entityController.getPaginatedEntities);

/**
 * @swagger
 * /api/tematicas:
 *   get:
 *     summary: Get all temáticas
 *     description: Retrieve a list of all video game arcade temáticas
 *     tags: [Common]
 *     responses:
 *       200:
 *         description: A list of temáticas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "1"
 *                   nombre:
 *                     type: string
 *                     example: "Plataformas"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/tematicas", commonController.getAllTematicas);


module.exports = router;
