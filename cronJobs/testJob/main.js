module.exports = {
    name: 'Test Job',
    disabled: true,
    trigger: '* * * * *', // run every minute
    action() {
        console.log('test cron action!')
    }
}