const testJob = require('./testJob/main');
const cron = require('node-cron');

/*
    minute	0-59
    hour	0-23
    day of month	0-31
    month	0-12 (or names)
    day of week	0-7 (0 or 7 is Sun, or use names)

    reference for cron expression:
    https://www.npmjs.com/package/node-cron
    https://crontab.guru/#*_*_*_*_*
*/

module.exports = () => {
    let jobs = [
        testJob
    ]

    console.group('Initialize cron jobs')
    // run all jobs
    for (let job of jobs) {
        // continue to next job when required field is not defined
        if (!job.trigger || !job.action) continue

        console.log(`- ${ job.name || 'Unknown' }`)
        // initialize all jobs
        cron.schedule(job.trigger, job.action);
    }
    console.groupEnd()
}