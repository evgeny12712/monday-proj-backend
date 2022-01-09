const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { getBoards, deleteBoard, addBoard, updateBoard, getBoardById } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getBoards)
router.post('/', log, addBoard)
router.delete('/:id', deleteBoard)
router.put('/', updateBoard)
router.get('/:id', getBoardById)

module.exports = router