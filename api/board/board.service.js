const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria()
        const collection = await dbService.getCollection('board')
        let boards = await collection.find().toArray()
        // let boards = await collection.find(criteria).toArray()
        // _filterBoards(filterBy, boards)
        if (!boards.length) {
            let board = _getEmptyBoard()
            board = await add(board)
            boards.push(board)
        };
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}


async function remove(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const criteria = { _id: ObjectId(boardId) }
        await collection.deleteOne(criteria)
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function add(board) {
    try {
        const collection = await dbService.getCollection('board')
        board = await collection.insertOne(board)
        board = board.ops[0]
        return board;
    } catch (err) {
        logger.error('cannot insert board', err)
        throw err
    }
}

async function update(board) {
    try {
        var id = ObjectId(board._id)
        delete board._id
        const collection = await dbService.getCollection('board')
        await collection.updateOne({ "_id": id }, { $set: { ...board } })
        board._id = id
        return board
    } catch (err) {
        logger.error(`cannot update board ${boardId}`, err)
        throw err
    }
}

async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board')
        const board = collection.findOne({ '_id': ObjectId(boardId) })
        return board
    } catch (err) {
        logger.error(`while finding board ${boardId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = { filterBy }
    return criteria
}

function _getEmptyBoard() {
    const group1 = _getEmptyGroup('rgb(87, 155, 252)');
    const group2 = _getEmptyGroup('rgb(162, 93, 220)');
    group1.id = _makeId();
    group2.id = _makeId();
    return {
        title: 'New Board',
        createdBy: {},
        members: [],
        groups: [group1, group2],
        activities: [],
        isFavorite: false,
        cmpsOrder: [
            'status-picker',
            'priority-picker',
            'member-picker',
            'date-picker',
            'timeline-picker',
            'tag-picker',
        ],
        cols: [
            {
                type: 'statusPicker',
                data: {
                    opts: _getStatusOptions(),
                    default: {
                        display: '',
                        style: {
                            backgroundColor: 'rgb(196, 196, 196)',
                        },
                    },
                    style: {
                        flexBasis: '140px',
                        maxWidth: '140px',
                    },
                },
            },
            {
                type: 'priorityPicker',
                data: {
                    opts: _getPriorityOptions(),
                    default: {
                        display: '',
                        style: {
                            backgroundColor: 'rgb(196, 196, 196)',
                        },
                    },
                    style: {
                        flexBasis: '140px',
                        maxWidth: '140px',
                    },
                },
            },
            {
                type: 'memberPicker',
                data: {
                    opts: [],
                    default: { members: [] },
                    style: {
                        flexBasis: '98px',
                        maxWidth: '98px',
                    },
                },
            },
            {
                type: 'datePicker',
                data: {
                    opts: [],
                    default: { dueDate: null },
                    style: {
                        flexBasis: '140px',
                        maxWidth: '140px',
                    },
                },
            },
            {
                type: 'timelinePicker',
                data: {
                    opts: [],
                    default: { dates: [], dayCount: 0 },
                    style: {
                        flexBasis: '140px',
                        maxWidth: '140px',
                    },
                },
            },
            {
                type: 'tagPicker',
                data: {
                    opts: [],
                    default: [],
                    style: {
                        flexBasis: '140px',
                        maxWidth: '140px',
                    },
                },
            },
        ],
        description: ''
    };
}

function _getStatusOptions() {
    return [
        {
            name: 'stuck',
            id: _makeId(),
            display: 'Stuck',
            style: {
                backgroundColor: 'rgb(226, 68, 92)',
            },
        },
        {
            name: 'done',
            id: _makeId(),
            display: 'Done',
            style: {
                backgroundColor: 'rgb(0, 200, 117)',
            },
        },
        {
            name: 'working on it',
            id: _makeId(),
            display: 'Working on it',
            style: {
                backgroundColor: 'rgb(253, 171, 61)',
            },
        },
    ];
}

function _getPriorityOptions() {
    return [
        {
            name: 'critical',
            id: _makeId(),
            display: 'Critical',
            style: {
                backgroundColor: 'rgb(226, 68, 92)',
            },
        },
        {
            name: 'high',
            id: _makeId(),
            display: 'High',
            style: {
                backgroundColor: 'rgb(255, 203, 0)',
            },
        },
        {
            name: 'medium',
            id: _makeId(),
            display: 'Medium',
            style: {
                backgroundColor: 'rgb(87, 155, 252)',
            },
        },
        {
            name: 'low',
            id: _makeId(),
            display: 'Low',
            style: {
                backgroundColor: 'rgb(0, 200, 117)',
            },
        },
        {
            name: 'best effort',
            id: _makeId(),
            display: 'Best Effort',
            style: {
                backgroundColor: 'rgb(128, 128, 128)',
            },
        },
    ];
}

function _getEmptyGroup(clr) {
    return { title: 'New Group', id: '', tasks: [], style: { clr } };
}

function _makeId(length = 5) {
    let txt = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++)
        txt += possible.charAt(Math.floor(Math.random() * possible.length));

    return txt;
}

module.exports = {
    query,
    remove,
    add,
    update,
    getById
}


