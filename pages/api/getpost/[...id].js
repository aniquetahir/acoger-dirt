import {getPost} from '../../../lib/posts'

export default function handler(req, res){
    const {query: {id},} = req;
    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(getPost(id[0])));
}