const { removeRedundancy } = require('./');

test('should remove duplicates', () => {
    let data = [
        { id: '123' },
        { id: '124' },
        { id: '125' },
        { id: '123' },
        { id: '126' },
        { id: '123' }
    ]

    let cleanData = removeRedundancy(data, 'id')
    // console.log(cleanData)

    expect(cleanData.length).toEqual(4)
})