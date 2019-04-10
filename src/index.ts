#!/usr/bin/env node

import * as figlet from 'figlet';

figlet('WP Plugin CLI', (err, data) => {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});