import {spawn} from 'child_process'

function get_sentiment(string, cb){
    let result = ''
    const p = spawn('python', ['scripts/emotion.py', string]);
    p.stdout.on('data', d=>result+=d);
    p.on('close', ()=>cb(result));
}


export default function handler(req, res){
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    get_sentiment(req.body, r=>res.end(r));
}