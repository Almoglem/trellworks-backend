const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const boardService = require('./board.service')

async function getBoards(req, res) {
    try {
        const isMinimized = req.query;
        const boards = await boardService.query(isMinimized)
        res.send(boards)
    } catch (err) {
        logger.error('Cannot get boards', err)
        res.status(500).send({ err: 'Failed to get boards' })
    }
}

async function getBoard(req, res) {
    try {
        const board = await boardService.getById(req.params.id)
        res.send(board)
    } catch (err) {
        logger.error('Failed to get board', err)
        res.status(500).send({ err: 'Failed to get board' })
    }
}

async function deleteBoard(req, res) {
    try {
        if (
            (req.params.id === '6062231855c6426f8c7ab2e1' ||
                req.params.id === '60632833f0c8d3001556781b' ||
                req.params.id === '606212907ad16945f0800c7f')
            && !req.session.user.isAdmin) {
            throw new Error('not eligable');
        }
        await boardService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        res.status(500).send({ err: 'Failed to delete board' })
        logger.error('Failed to delete board', err)

    }
}

async function addBoard(req, res) {
    try {
        const board = req.body
        const savedBoard = await boardService.add(board)
        res.send(savedBoard)
    } catch (err) {
        logger.error('Failed to save board', err)
        res.status(500).send({ err: 'Failed to save board' })
    }
}

async function updateBoard(req, res) {
    try {
        const board = req.body
        const savedBoard = await boardService.update(board)
        res.send(savedBoard)
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(500).send({ err: 'Failed to update board' })
    }
}

module.exports = {
    getBoards,
    getBoard,
    deleteBoard,
    addBoard,
    updateBoard
}