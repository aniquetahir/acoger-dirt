import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import PostDisplay from "../components/post-display";
import useSWR from "swr";
import DeckGL from '@deck.gl/react';
import {COORDINATE_SYSTEM, OrbitView, LinearInterpolator} from '@deck.gl/core';
import {LineLayer, PointCloudLayer} from '@deck.gl/layers';
import {LASWorkerLoader} from '@loaders.gl/las'
import {useState, useEffect} from "react";


export const fetcher = (...args)=>fetch(...args).then(res=>res.json());

export async function getStaticProps() {
    const allPostsData = getSortedPostsData()
    return {
        props: {
            allPostsData
        }
    }
}

function DeckTestPCL({onLoad}){
    const LAZ_SAMPLE = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/point-cloud-laz/indoor.0.1.laz';
    const INITIAL_VIEW_STATE = {
        target: [0,0,0],
        rotationX: 0,
        rotationOrbit: 0,
        orbitAxis: 'Y',
        fov: 50,
        minZoom: 0,
        maxZoom: 10,
        zoom: 1
    }

    const transitionInterpolator = new LinearInterpolator(['rotationOrbit']);

    const [viewState, updateViewState] = useState(INITIAL_VIEW_STATE);
    const [isLoaded, setIsLoaded] = useState(false);
    const [hoverInfo, setHoverInfo] = useState();
    const [clickInfo, setClickInfo] = useState();

    useEffect(
        () => {
            if(!isLoaded){
                return;
            }

            const rotateCamera = () => {
                updateViewState(v => ({
                  ...v,
                  rotationOrbit: v.rotationOrbit + 120,
                  transitionDuration: 2400,
                  transitionInterpolator,
                  onTransitionEnd: rotateCamera
                }));
            };
            rotateCamera();
        },
        [isLoaded]
    );

    const onDataLoad = ({header}) => {
        if (header.boundingBox) {
            const [mins, maxs] = header.boundingBox;
            updateViewState({
                ...INITIAL_VIEW_STATE,
                target: [(mins[0] + maxs[0])/2, (mins[1] + maxs[1])/2, (mins[2] + maxs[2])/2],
                zoom: Math.log2(window.innerWidth / (maxs[0] - mins[0])) - 1
            });
            setIsLoaded(true);
        }

        if (onLoad) {
            onLoad({count: header.vertexCount, progress: 1});
        }
    };

    const layers = [
        new PointCloudLayer({
            id: 'laz-point-cloud-layer',
            data: LAZ_SAMPLE,
            onDataLoad,
            coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
            getNormal: [0, 1, 0],
            getColor: [255, 255, 255],
            opacity: 0.5,
            pointSize: 0.5,
            pickable: true,
            loaders: [LASWorkerLoader],
            onHover: info => {setHoverInfo(info)},
            onClick: info => {console.log(info); setClickInfo(info);}
        })
    ];

    return (
        <DeckGL views={new OrbitView()}
                viewState={viewState}
                controller={true}
                onViewStateChange={v => updateViewState(v.viewState)}
                layers={layers}
                onClick={()=>setHoverInfo(null)}
                parameters = {{
                    clearColor: [0.93, 0.86, 0.81, 1]
                }}

        >
            {
                hoverInfo && hoverInfo.index!=-1 && (
                    <div>
                        <div  style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y}}
                              class="uk-card uk-card-default uk-card-small uk-card-body">
                            <h3 class="uk-card-title">Node</h3>
                            <p>Index: {hoverInfo.index}</p>
                        </div>
                    </div>
                )
            }
            {/*{hoverInfo.object && (*/}
            {/*    <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y}}>*/}
            {/*        hello*/}
            {/*    </div>*/}
            {/*)}*/}

        </DeckGL>
    );
}

export function DeckLayer(){
    const INITIAL_VIEW_STATE = {
        longitude: -122.41669,
        latitude: 37.7853,
        zoom: 13,
        pitch: 0,
        bearing: 0
    };

    // Data for Line layer
    const data = [
        {sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}
    ];

    const layers = [
        new LineLayer({id: 'line-layer', data})
    ];

    return (
        <DeckGL initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        />
    );
}

export default function Home({allPostsData}) {
  return (
      <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
          <div onContextMenu={event => event.preventDefault()}>
              <DeckTestPCL onLoad={true} />
          </div>

          {/* <PostDisplay posts={useSWR('api/posts_sample', fetcher, {refreshInterval: 10000})} /> */}
        {/*<section className={utilStyles.headingMd}>*/}
        {/*  <p>[Your Self Introduction]</p>*/}
        {/*  <p>*/}
        {/*    (This is a sample website - you’ll be building a site like this on{' '}*/}
        {/*    <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)*/}
        {/*  </p>*/}
        {/*</section>*/}
        {/*  <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>*/}
        {/*      <h2 className={utilStyles.headingLg}>Blog</h2>*/}
        {/*      <ul className={utilStyles.list}>*/}
        {/*          {allPostsData.map(({ id, date, title }) => (*/}
        {/*              <li className={utilStyles.listItem} key={id}>*/}
        {/*                  {title}*/}
        {/*                  <br />*/}
        {/*                  {id}*/}
        {/*                  <br />*/}
        {/*                  {date}*/}
        {/*              </li>*/}
        {/*          ))}*/}
        {/*      </ul>*/}
        {/*  </section>*/}
      </Layout>
  )
}
