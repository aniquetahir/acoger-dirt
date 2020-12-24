import {spawn} from 'child_process'

function get_ner(string, cb){
    let result = ''
    const p = spawn('python', ['scripts/entities.py', string]);
    p.stdout.on('data', d=>result+=d);
    p.on('close', ()=>cb(result));
}


export default function handler(req, res){
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    get_ner('Hello Canadian world', r=>res.end(JSON.stringify({'ent': r})));
}