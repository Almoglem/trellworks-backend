const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(isMinimized) {
    try {
        const collection = await dbService.getCollection('board')
        let boards = await collection.find().toArray();
        if (isMinimized) {
            miniBoards = boards.map(board => {
                return {
                    _id: board._id,
                    title: board.title,
                    styles: board.styles,
                    isStarred: board.isStarred
                }
            });
            console.log('mini boards', miniBoards);
            return miniBoards;
        }
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}


async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        await collection.deleteOne({ '_id': ObjectId(boardId) })
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = await collection.findOne({ '_id': ObjectId(boardId) })
        if(board.activities.length >= 50) board.activities.splice(board.activities.length-1, 1)
        return board
    } catch (err) {
        logger.error(`while finding toy ${boardId}`, err)
        throw err
    }
}

async function update(board) {
    try {
        const boardToSave = board;
        boardToSave._id = ObjectId(boardToSave._id);
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ '_id': boardToSave._id }, { $set: boardToSave })
        return boardToSave;
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

async function add(board) {
    try {
        const boardToAdd = board;
        const collection = await dbService.getCollection('board')
        console.log(collection.length, 'from db');
        await collection.insertOne(boardToAdd)
        return boardToAdd;
    } catch (err) {
        logger.error('cannot insert review', err)
        throw err
    }
}

module.exports = {
    query,
    remove,
    add,
    getById,
    update
}


