import {script_output} from '../../../lib/posts'

export default async function handler(req, res){
    const {query: {id},} = req;
    res.setHeader('Content-Type', 'application/json');
    const output = await script_output('scripts/get_reply.py', id);
    res.end(output);
}