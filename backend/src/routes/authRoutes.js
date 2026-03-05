const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             name: Praveen
 *             email: praveen@praveen.com
 *             password: praveen_praveen
 *             role: student
 *             college: collegeId
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *            application/json:
 *              example:
 *               _id: userId_here
 *               name: Praveen
 *               email: praveen@praveen.com
 *               role: student
 *               token: jwt_token_here
 */


router.post("/register", registerUser);


/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: Login user
 *    tags: [Auth]
 *    requestBody:
 *        required: true
 *        content:
 *           application/json:
 *              example:
 *                email: praveen@praveen.com
 *                password: praveen_praveen
 *    responses:
 *      200:
 *        description: User logged in successfully
 *        content:
 *            application/json:
 *              example:
 *               _id: userId_here
 *               name: Praveen
 *               email: praveen@praveen.com
 *               role: student
 *               token: jwt_token_here
 */
router.post("/login", loginUser);
router.get("/me",protect, getMe);

module.exports = router;