const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('board')
        var boards = await collection.find(criteria).toArray()
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}

// async function remove(reviewId) {
//     try {
//         const store = asyncLocalStorage.getStore()
//         const { userId, isAdmin } = store
//         const collection = await dbService.getCollection('review')
//         // remove only if user is owner/admin
//         const query = { _id: ObjectId(reviewId) }
//         if (!isAdmin) query.byUserId = ObjectId(userId)
//         await collection.deleteOne(query)
//         // return await collection.deleteOne({ _id: ObjectId(reviewId), byUserId: ObjectId(userId) })
//     } catch (err) {
//         logger.error(`cannot remove review ${reviewId}`, err)
//         throw err
//     }
// }

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = await collection.findOne({ '_id': ObjectId(boardId) })
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
        return toyToSave;
    } catch (err) {
        logger.error(`cannot update board ${board._id}`, err)
        throw err
    }
}

async function add(review) {
    try {
        // peek only updatable fields!
        const reviewToAdd = {
            byUserId: ObjectId(review.byUserId),
            aboutUserId: ObjectId(review.aboutUserId),
            txt: review.txt
        }
        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        return reviewToAdd;
    } catch (err) {
        logger.error('cannot insert review', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    return criteria
}

module.exports = {
    query,
    // remove,
    add,
    getById,
    update
}


