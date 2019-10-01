fetch('/getData').then(request => request.json().then(data => {
    export const app = new Vue({
        el: '#table',
        data: {
            prices: data
        }
    })
}))
