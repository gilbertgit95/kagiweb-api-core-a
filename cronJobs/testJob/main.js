module.exports = {
    name: 'Test Job',
    trigger: '* * * * *', // run every minute
    action() {
        console.log('test cron action!')
    }
}