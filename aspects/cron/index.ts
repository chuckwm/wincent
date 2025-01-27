import {
    command,
    cron,
    file,
    resource,
    skip,
    template,
    task,
    variable,
} from 'fig';

task('create ~/Library/Cron', async () => {
    await file({
        path: '~/Library/Cron',
        state: 'directory',
    });
});

task('create ~/Library/Cron/check-git', async () => {
    await template({
        mode: '0755',
        path: '~/Library/Cron/check-git.sh',
        src: resource.template('check-git.sh.erb'),
    });
});

task('schedule check-git cron job', async () => {
    if (variable('identity') === 'wincent') {
        await cron({
            id: 'check-git',
            hour: '8,12,16,20',
            job: '$HOME/Library/Cron/check-git.sh',
            minute: '0',
        });
    } else {
        skip();
    }
});

task('touch ~/mbox', async () => {
    // Because cron jobs can produce mail.
    await file({path: '~/mbox', state: 'touch'});
});

task('hide ~/mbox', async () => {
    await command('chflags', ['hidden', '~/mbox']);
});
