const { userStatusList } = require("./consts");

function setStatus(userId, status) {
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

const getText = (msg) => {
    return msg.text || msg.data
}

function setField(userId, field, value) {
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

const getChatId = (msg) => msg.chat?.id ?? msg.message.chat.id;

const getCommand = (msg) => {
    const chatId = getChatId(msg);
    const userStatus = getField(chatId, "status");
    if (userStatus === "command" || !userStatus) {
        return msg.text?.split(' ')[0] || msg.data?.split(' ')[0]
    }
    return userStatus;
};

const getProps = (msg) => {
    const propList = (msg.text?.split(' ') || msg.data?.split(' '))?.slice(1);

    return propList?.reduce((acc, el) => {
        const [key, value] = el.split("=");
        acc[key] = value
        return acc;
    }, {})
}




module.exports = {
    setStatus,
    setField,
    getField,
    getCommand,
    getChatId,
    getProps,
    getText
}