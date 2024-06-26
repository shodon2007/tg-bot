const { userStatusList } = require("./consts");

const setStatus = (userId, status) => {
    const statusIndex = userStatusList.findIndex(el => el.id === userId);

    if (statusIndex === -1) {
        userStatusList.push({
            id: userId,
            status: status,
        })
    } else {
        userStatusList[statusIndex].status = status;
    }
}

const setField = (userId, field, value) => {
    const index = userStatusList.findIndex(el => el.id === userId);

    if (index === -1) {
        userStatusList.push({
            id: userId,
            status: "command",
            [field]: value
        })
    } else {
        userStatusList[index][field] = value;
    }
}

const getField = (userId, field) => {
    const index = userStatusList.findIndex(el => el.id === userId);

    if (index === -1) {
        return null;
    } else {
        return userStatusList[index][field];
    }
}

module.exports = {
    setStatus,
    setField,
    getField
}