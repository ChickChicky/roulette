const { getch, input, CancelChar } = require('./input.js');

const aL = '#';
const oL = '#';
const aB = '|';
const oB = '|';

;(async()=>{

    // console.log('\x1b[35;1m---------------------------------\x1b[22m')
    // console.log('l/L to remove/add one live round');
    // console.log('b/B to remove/add one blank round');
    // console.log('r/t to set live/blank rounds');
    // console.log('type the initial amounts to start');
    // console.log('\x1b[1m---------------------------------\x1b[22m\x1b[39m')

    for (;;) {
        const inp = await input('? ');
        
        if (!inp) {
            console.log('\x1b[A\x1b[G\x1b[K\x1b[A');
            continue;
        }

        if (inp == CancelChar)
            break;

        const inpt = inp.match(/\s*(\d+)\s*[,. ]\s*(\d+)\s*/);

        if (!inpt) {
            console.log('\x1b[A\x1b[G\x1b[K\x1b[A');
            continue;
        }

        let [, live, blank] = inpt.map(v=>+v);
        let olive = 0;
        let oblank = 0;

        console.log('\x1b[A\x1b[G\x1b[K\x1b[A\n');

        for (;;) {
            const ck = blank+live;
            const lk = ck == 0 ? 0 : live/ck;
            const bk = ck == 0 ? 0 : blank/ck;

            console.log(
                `\x1b[2A\x1b[G\x1b[31;2m${oL.repeat(olive)}\x1b[39;22m\x1b[91;1m${aL.repeat(live)}\x1b[39;22m\x1b[97;1m${aB.repeat(blank)}\x1b[39;22m\x1b[90;2m${oB.repeat(oblank)}\x1b[39;22m \x1b[2m(\x1b[31m${live}\x1b[39m/\x1b[37m${blank}\x1b[39m)\x1b[22m\x1b[K\n` +
                `${' '.repeat(olive)}\x1b[90m${'‾'.repeat(live)}${'‾'.repeat(blank)}\x1b[39m${' '.repeat(oblank)} \x1b[2m(\x1b[31m${lk==1?'$$':lk==0?'..':Math.round(lk*100).toString().padStart(2,'0')}\x1b[39m/\x1b[37m${bk==1?'$$':bk==0?'..':Math.round(bk*100).toString().padStart(2,'0')}\x1b[39m)\x1b[22m\x1b[K`
            );

            const c = await getch(true, 'utf-8', ()=>null, ()=>null);

            if (!c || c == '\x1b')
                break;
            
            switch (c) {
                case 'l':
                case 'r': {
                    if (live <= 0)
                        break;
                    olive++;
                    live--;
                } break;
                case 'b':
                case 't': {
                    if (blank <= 0)
                        break;
                    oblank++;
                    blank--;
                } break;
                case 'L':
                case 'R': {
                    if (olive <= 0)
                        break;
                    live++;
                    olive--;
                } break;
                case 'B':
                case 'T': {
                    if (oblank <= 0)
                        break;
                    blank++;
                    oblank--;
                } break;
                case 'f': {
                    const v = await input('\x1b[31m?\x1b[39m ');
                    if (!v || v == CancelChar || Number.isNaN(+v))
                        break;
                    live = +v;
                    olive = 0;
                    console.log('\x1b[A\x1b[G\x1b[K\x1b[A');
                } break;
                case 'g': {
                    const v = await input('\x1b[37m?\x1b[39m ');
                    if (!v || v == CancelChar || Number.isNaN(+v))
                        break;
                    blank = +v;
                    oblank = 0;
                    console.log('\x1b[A\x1b[G\x1b[K\x1b[A');
                } break;
            }
        }

        process.stdout.write('\x1b[A\x1b[G\x1b[K'.repeat(3))
    }

})();
