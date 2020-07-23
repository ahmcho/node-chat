const generateMessage = (username,text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username,url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

const generateAudioMessage = (username, blob) => {
    return {
        username,
        blob,
        createdAt: new Date().getTime()
    }
}

const generatePictureMessage = (username, blob) => {
    return {
        username,
        blob,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage,
    generateAudioMessage,
    generatePictureMessage
}