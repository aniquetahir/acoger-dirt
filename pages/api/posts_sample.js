import {getSamplePosts} from '../../lib/posts'


export default async function handler(req, res){
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({'posts': await getSamplePosts()}));
}