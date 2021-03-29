const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')


async function login(username, password) {
    logger.debug(`auth.service - login with username: ${username}`)

    const user = await userService.getByUsername(username)
    if (!user) return Promise.reject('Invalid username or password')
    // TODO: un-comment for real login
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid username or password')

    delete user.password
    return user
}

async function signup(username, password, fullname, profileImg) {
    const saltRounds = 10

    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname) return Promise.reject('fullname, username and password are required!')


    const users = await userService.query();

    for (i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return Promise.reject('Username is already taken')
        }
    }
    // users.forEach(user => {
    //     if (user.username === username) {
    //         Promise.reject('Username is already taken')
    //         return;
    //     }
    // });

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname, profileImg })
}

module.exports = {
    signup,
    login,
}