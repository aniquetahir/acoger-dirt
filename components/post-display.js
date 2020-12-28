import Link from "next/link";

export default function PostDisplay({posts}){
    let {error, data} = posts;
    //console.log(data);
    return (
        <>
            {!data?(<><div uk-spinner='' /><span>  Loading</span></>):(
                !error?(<ul className="uk-list uk-list-striped">{
                    data['posts'].map(p=>(
                        <li>
                            <Link href={`posts/${p['id']}`}>
                                <a>{p['source']}</a>
                            </Link>
                        </li>
                    ))
                }</ul>):(
                    <span>Error Fetching Data</span>
                )
            )}
        </>
    );
}