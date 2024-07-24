"use client";

import {useParams, useRouter} from "next/navigation";
import {Item} from "./item";
import {formatDateTime} from "@/lib/utils";
import {Boxes} from "lucide-react";
import useStore from "@/store/clusters";

export const ClusterList = () => {
    const params = useParams();
    const router = useRouter();

    const clusters = useStore((state) => state.store);

    const onRedirect = (clusterId: string) => {
        router.push(`/clusters/${clusterId}`);
    };

    if (clusters === undefined) {
        return (
            <>
                <Item.Skeleton/>
            </>
        );
    }

    return (
        <>
            {clusters.map((cluster) => (
                <div key={cluster.id}>
                    <Item
                        onClick={() => onRedirect(cluster.sha)}
                        isCluster={cluster.numberOfRepos}
                        label={formatDateTime(cluster.clusterDate)}
                        icon={Boxes}
                        active={params.id == cluster.sha}
                    />
                </div>
            ))}
        </>
    );
};