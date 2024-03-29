import {getPost} from '../../../lib/posts'

export default async function handler(req, res){
    const {query: {id},} = req;
    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(await getPost(id)));
}