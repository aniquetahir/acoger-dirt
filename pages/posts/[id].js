import Layout from "../../components/layout";
import useSWR from "swr";
import {fetcher} from "../index";
import {AllHtmlEntities} from "html-entities";
import {Component} from 'react';
import _ from 'lodash';


const hencoder = AllHtmlEntities.encode

//import { getAllPostIds, getPostData } from '../../lib/posts'

function LoadingDataView({nodata, children}){
    return (
        <div className='uk-column-span'>
        {   (nodata)?(
                <div uk-spinner='' />
            ):(
             <>
                 {children}
             </>
            )}
        </div>
    );
}

function RepliesView({replies}){
    const table = !_.isNil(replies)?(
        <table className="uk-table uk-table-hover uk-table-divider">
            <thead>
            <tr>
                <th>Reply</th>
                <th>Sentiment</th>
            </tr>
            </thead>
            <tbody>
                {replies.map(r=>(
                    <tr>
                        <td>{r.text}</td>
                        <td>{r.sentiment.label}</td>
                    </tr>
                ))}

            </tbody>
        </table>
    ):([]);

    return (
        <LoadingDataView nodata={_.isNil(replies)}>
            {table}
        </LoadingDataView>
    );
}

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
                platform: null,
                source: null,
                ner: null,
                sentiment: null,
                replies: null
            }
        }
    }

    async componentDidMount(){
        const {postData} = this.props;
        console.log('Component mounted');

        if(this.state.id){
           console.log(postData);
            fetch(`/api/getreplies/${postData.id}`)
                .then(r=>r.json())
                .then(j=>this.setState({replies: j}));
           let m_data = await fetch(`/api/getpost/${postData['id']}`);
           m_data = await m_data.json();
           this.setState(m_data);
            // Get NER
            fetch('/api/ner', { method: 'POST', body: m_data.source })
                .then(r=>r.json())
                .then(j=>this.setState({ner: j.ent}));
            fetch('/api/sentiment', { method: 'POST', body: m_data.source })
                .then(r=>r.json())
                .then(j=>this.setState({sentiment: j}));



        }



    }

    render(){

        // return (<span>{JSON.stringify(postData)}</span>)
        // const {error, data} = postData?useSWR(`api/getpost/${postData['id']}`, fetcher):null;
        return (
            <Layout>
                <article className="uk-article">

                    <p className="uk-text-lead">{this.state['source']}</p>

                    <div>
                        <div className='uk-column-span'>
                            Source: {this.state['platform']}
                        </div>
                        <div className='uk-column-span'>
                            Sentiment:
                        </div>
                            <LoadingDataView nodata={_.isNil(this.state.sentiment)}>
                                {
                                    <table className="uk-table uk-table-hover uk-table-divider">
                                        <thead>
                                        <tr>
                                            <th></th>
                                            {_.isNil(this.state.sentiment)?'':Object.keys(this.state.sentiment).map(m=>(
                                                <th>{m}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>Label</td>
                                            {_.isNil(this.state.sentiment)?'':Object.values(this.state.sentiment).map(m=>(
                                                <th>{m.label}</th>
                                            ))}
                                        </tr>
                                        <tr>
                                            <td>Score</td>
                                            {_.isNil(this.state.sentiment)?'':Object.values(this.state.sentiment).map(m=>(
                                                <th>{m.score}</th>
                                            ))}
                                        </tr>

                                        </tbody>
                                    </table>
                                }
                            </LoadingDataView>
                        <div className='uk-column-span'>
                            Polarity:
                        </div>
                        <div className='uk-column-span'>
                            Entities:
                        </div>
                        <LoadingDataView nodata={_.isNil(this.state.ner)} >
                            <div className='uk-column-span' dangerouslySetInnerHTML={{__html: this.state.ner}} />
                        </LoadingDataView>

                        <div className='uk-column-span'>
                            Replies:
                        </div>
                        <RepliesView replies={this.state.replies} />

                        <div className='uk-column-span'>
                            Similar:
                        </div>

                    </div>

                </article>
            </Layout>

        );
    }

}






