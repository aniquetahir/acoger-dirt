import Layout from "../../components/layout";
import useSWR from "swr";
import {fetcher} from "../index";
import {AllHtmlEntities} from "html-entities";
import {Component} from 'react';


const hencoder = AllHtmlEntities.encode

//import { getAllPostIds, getPostData } from '../../lib/posts'


export async function getServerSideProps({ params }) {
    //const postData = getPostData(params.id)


    return {
        props: {
            postData: params
        }
    }
}

export default class Post extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);

        if(this.props.postData) {
            this.state = {
                id: this.props.postData.id,
                content: null,
                source: null
            }
        }
    }

    async componentDidMount(){
        const {postData} = this.props;
        console.log('Component mounted');

        if(this.state.id){
           console.log(postData);
           let m_data = await fetch(`/api/getpost/${postData['id']}`);
           m_data = await m_data.json();
           this.setState(m_data);
        }

        // Get NER


    }

    render(){

        // return (<span>{JSON.stringify(postData)}</span>)
        // const {error, data} = postData?useSWR(`api/getpost/${postData['id']}`, fetcher):null;
        return (
            <Layout>
                <article className="uk-article">

                    <p className="uk-text-lead">{this.state['content']}</p>

                    <div>
                        <div className='uk-column-span'>
                            Source: {this.state['source']}
                        </div>
                        <div className='uk-column-span'>
                            Sentiment:
                        </div>
                        <div className='uk-column-span'>
                            Polarity:
                        </div>
                        <div className='uk-column-span'>
                            Entities:
                        </div>
                        <div className='uk-column-span'>
                            Similar:
                        </div>

                    </div>

                </article>
            </Layout>

        );
    }

}




// export async function getStaticPaths(){
//     const paths = [] //getAllPostIds()
//     return {
//         paths,
//         fallback: true
//     }
// }

