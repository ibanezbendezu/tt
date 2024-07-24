"use client"

import {Spinner} from "@/components/spinner";
import {useEffect, useState} from "react";
import {Cluster} from "./_components/cluster";
import {clusterDataRequestBySha} from "@/api/server-data";
import {clusterCytoscape} from "./_components/utils";

export default function GraphPage({params}: { params: any }) {

    const [data, setData] = useState<{ data: any }[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await clusterDataRequestBySha(params.id);

            const cytoscapeFormat = clusterCytoscape(res.data)
            const elements = [
                ...cytoscapeFormat.nodes.map(node => ({data: node.data})),
                ...cytoscapeFormat.edges.map(edge => ({data: edge.data}))
            ];
            setData(elements);
            setLoading(false);
        };

        fetchData().then(r => r);
    }, [params.id]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            {data && <Cluster data={data} clusterId={params.id}/>}
        </div>
    );
};