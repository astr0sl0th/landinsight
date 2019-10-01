const fs = require('fs')
const path = require('path')
const express = require('express')

const app = express()

app.use(express.static(path.join(__dirname, '../public')));

const priceData = new Promise((resolve, reject) => {
    fs.readFile(`sold-price-data.txt`, 'utf8', function (err, contents) {
        if (err) {
            reject(err)
        }
        const data = contents
            .split("\n")
            .map(row => {
                const [x = 0, y = 0, p = 0] = row
                    .trim()
                    .split(" ")
                    .map(p => parseInt(p, 10));
                return { x, y, p };
            });

        const sum = data.reduce((sum, row) => (sum += row.p), 0);
        const average = sum / data.length / 100;

        const calcGroup = price => {
            const devpercentage = price / average / 2;
            if (devpercentage <= 5) return { color: '#58BC82' }
            if (devpercentage <= 25) return { color: '#8FE388' }
            if (devpercentage <= 75) return { color: '#645986' };
            if (devpercentage <= 95) return { color: '#801A86' };
            return { color: '#4E0250' };
        };

        const weigtedData = data.map(row => ({
            ...row,
            weight: row.p / average,
            plotColorGroup: calcGroup(row.p)
        }));

        const [max, min] = weigtedData.reduce(
            ([max, min], row) => [Math.max(row.weight, max), Math.min(row.weight, min)],
            [0, 9999]
        );
        resolve(weigtedData)
    })
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.get('/getData', async (req, res) => {
    try {
        const data = await priceData
        res.json(data)

    } catch (error) {
        res.status(500).json({
            message: error
        })
    }

})

module.exports = app