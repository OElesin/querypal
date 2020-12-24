

const queryDao = {
    async addNewQueryToLocalStorage(image){
        console.log("Added images to local storage")
        const result = await localStorage.getItem('userQueryList')
        const payload = (result !== 'undefined' || result !== null) ? JSON.parse(result) : [];
        payload.push(image)
        let userContentList = JSON.stringify(payload)
        localStorage.setItem('userQueryList', userContentList)
    }
}

export default queryDao
