"use client"

import React, {useState, useEffect} from 'react';
import cytoscape, {Core} from 'cytoscape';
import CytoscapeComponent from "react-cytoscapejs";
import dagre from "cytoscape-dagre";
import fcose from "cytoscape-fcose";
import cola from 'cytoscape-cola';
import undoRedo from "cytoscape-undo-redo";
import expandCollapse from 'cytoscape-expand-collapse';
import popper from 'cytoscape-popper';
import navigator from "cytoscape-navigator";
import {graphStyles} from './style';
import "cytoscape-navigator/cytoscape.js-navigator.css";
import "./style.css";

import {FileDialog} from '@/app/(main)/(routes)/clusters/[id]/graph/_components/file-dialog';
import {PairDialog} from '@/app/(main)/(routes)/clusters/[id]/graph/_components/pair-dialog';

import {pairsByClusterShaDataRequest, pairByIdDataRequest} from '@/api/server-data';
import {fileCytoscape} from './utils';
import {Legend} from './legends';

cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(fcose);
cytoscape.use(expandCollapse);
cytoscape.use(popper);
cytoscape.use(navigator);

type ClusterProps = {
    data: any;
    clusterId: any;
};

export const Cluster: React.FC<ClusterProps> = ({data, clusterId}) => {
    const [isFileOpen, setIsFileOpen] = useState(false);
    const [isPairOpen, setIsPairOpen] = useState(false);
    const [file, setFile] = useState<any>(null);
    const [pair, setPair] = useState<any>(null);
    const [graphData, setGraphData] = useState<any>(null);

    const handlePair = async (e: any) => {
        const pairId = parseInt(e.id.split("-")[1], 10);
        const res = await pairByIdDataRequest(pairId);
        const pair = res.data;

        setPair(pair);
        setIsPairOpen(true);
    }

    const handleFile = async (e: any) => {
        const fileSha = e.sha;
        const res = await pairsByClusterShaDataRequest(clusterId, fileSha);
        const fileData = res.data.file;

        const cytoscapeFormat = fileCytoscape(res.data)
        const elements = [
            ...cytoscapeFormat.nodes.map(node => ({data: node.data})),
            ...cytoscapeFormat.edges.map(edge => ({data: edge.data}))
        ];

        setFile(fileData);
        setGraphData(elements);
        setIsFileOpen(true);
    }

    const config = {
        layout: {
            name: "fcose",
            animate: false,
            randomize: true,
            fit: true,
            nodeSeparation: 70,
            idealEdgeLength: 130,
        },
        zoom: 0.7,
    };

    const [cy, setCy] = useState<Core | null>(null);

    useEffect(() => {
        if (cy) {
            const api = cy.expandCollapse({
                layoutBy: {
                    name: "preset",
                    randomize: true,
                    fit: true,
                    animate: true,
                    undoable: true,
                },
                collapseCueImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up"><path d="m6 15 6-6 6 6"/></svg>',
                expandCueImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>',
            });

            const defaults = {
                container: false, viewLiveFramerate: 0, thumbnailEventFramerate: 30, thumbnailLiveFramerate: false,
                dblClickDelay: 200, removeCustomContainer: false, rerenderDelay: 100
            };
            // @ts-ignore
            const nav = cy.navigator(defaults);

            return () => {
                if (nav) {
                    nav.destroy();
                }
            };
        }
    }, [cy]);

    return (
        <>
            <FileDialog
                isOpen={isFileOpen}
                setIsOpen={setIsFileOpen}
                file={file}
                graphData={graphData}
            >
            </FileDialog>
            <PairDialog
                isOpen={isPairOpen}
                setIsOpen={setIsPairOpen}
                pair={pair}
            >
            </PairDialog>
            <CytoscapeComponent
                cy={(cy) => {
                    setCy(cy);
                    cy.on("click", "edge", (e: any) => {
                        handlePair(e.target.data()).then(r => console.log(r));
                    });
                    cy.on("click", "node[type='file']", (e: any) => {
                        handleFile(e.target.data()).then(r => console.log(r));
                    });
                }}
                layout={config.layout}
                styleEnabled={true}
                stylesheet={graphStyles}
                elements={data}
                wheelSensitivity={0.1}
                zoomingEnabled={true}
                zoom={config.zoom}
                style={{height: "100vh" as React.CSSProperties['height'], width: "100%"}}
            />
            <Legend/>
        </>
    );
};