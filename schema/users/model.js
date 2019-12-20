const db = require('../../data/dbConfig')

const getUsers = () => db('users')

const addUser = user => {
    return db('users').insert(user)
}

const findByUsername = username => {
    return db('users').where(username)
}

module.exports = {
    getUsers,
    addUser,
    findByUsername
}