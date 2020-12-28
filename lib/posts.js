import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import _ from 'lodash'
import {spawn} from 'child_process'

const postsDirectory = path.join(process.cwd(), 'posts')

export function script_output(script_path, args){
    return new Promise((res, rej)=>{
        let result = ''
        const t_args = _.isNil(args)?[script_path]:[script_path, ...args];
        console.log(t_args);
        const p = spawn('python', t_args);
        p.stdout.on('data', d=>result+=d);
        p.on('close', ()=>res(result));
        p.on('error', (err)=>{console.log(err);rej(err)});
    });
}

export async function getSamplePosts(){
    let output = await script_output('scripts/get_posts.py');
    //console.log('OUT'+output);
    const posts = JSON.parse(output);
    return _.shuffle(posts);
}

export async function getPost(id){
    console.log('aoeua');
    const all_posts = await getSamplePosts();

    return _.find(all_posts, {id: id[0]});
}

export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the id
        return {
            id,
            ...matterResult.data
        }
    })
    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllPostIds(){
    const fileNames = fs.readdirSync(postsDirectory)

    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
        id,
        ...matterResult.data
    }
}
