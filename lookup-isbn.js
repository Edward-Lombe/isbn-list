const fetch = require('isomorphic-fetch')
const API_KEY = 'AIzaSyB5zAPHaDpY4SMTKUOyKgXeb7m5yKQoqBE'
const fs = require('fs')

// read file and split into an array of each line
const csv = fs.readFileSync('./isbns.csv').toString().split('\n')

main()

async function main() {
    // iterate over each line in our array
    for (const isbn of csv) {
        // remove hyphens from each isbn
        const strippedIsbn = isbn.replace(/\-/g, '')
        const search = 'isbn:' + strippedIsbn
        const url = 'https://www.googleapis.com/books/v1/volumes?q=' + search //+ '&key=' + API_KEY
        await fetch(url)
            .then(response => {
                if (response.status !== 200) {
                    throw new Error(isbn + ' not found')
                }
                return response.json()
            })
            .then(json => {
                return fetch(json.items[0].selfLink)

            })
            .then(r => r.json())
            .then(json => {
                console.log(json)
            })
            .catch((e) => { console.error(e) })
    }
}

