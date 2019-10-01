fetch('/getData').then(request => request.json().then(data => {
    console.log(data)
    const app = new Vue({
        el: '#table',
        data: {
            todos: data
        }
    })
}))
