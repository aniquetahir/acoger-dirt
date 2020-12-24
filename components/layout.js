import Head from "next/head";
import styles from './layout.module.css'
import Link from "next/link";
import {Component} from 'react'


const name = 'Anique'
export const siteTitle = 'DMML Interface for Rumor Tracking'

class NavBar extends Component{
    render(props){
        return (
            <div
                uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky; bottom: #transparent-sticky-navbar">
                <nav className="uk-navbar-container" uk-navbar="" style={{'position': 'relative', 'zIndex': 980}}>
                    <div className="uk-navbar-left">
                        <span className="uk-navbar-item uk-logo">DMML Interface for Rumor Tracking</span>
                        <ul className="uk-navbar-nav">
                            <li className={this.props.home?"uk-active":""}><a href="/">Home</a></li>
                            <li><a href="#">About</a></li>
                        </ul>

                    </div>
                </nav>
            </div>
        );
    }
}

export default function Layout({children, home}){
    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta name="og:title" content={siteTitle} />
            </Head>
            <NavBar home={home} />
            <main className='uk-container uk-container-expand'>{children}</main>
            {!home && (
                <div className={styles.backToHome}>
                    <Link href="/">
                        <a>← Back to home</a>
                    </Link>
                </div>
            )}
        </div>
    )
}

