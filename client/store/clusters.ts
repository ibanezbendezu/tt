import {create} from 'zustand'
import {persist} from "zustand/middleware";

type StoreItem = {
    id: number;
    clusterDate: string;
    comparisons: Array<any>;
    numberOfRepos: number;
    repositories: Array<any>;
}

type State = {
    store: Array<any>,
    cluster: any,
}

type Actions = {
    setCluster: (params: { newCluster: any }) => void,
    addClusterToStore: (params: { newCluster: any }) => void,
    removeClusterFromStore: (params: { itemIndex: number }) => void,
    emptyStore: () => void,
    updateClusterInStore: (params: { id: number, updatedCluster: any }) => void
}

const useStore = create(persist<State & Actions>(
    (set) => ({
        store: [],
        cluster: {},
        openModal: false,
        setCluster: (params) => {
            const {newCluster} = params
            set((state) => {
                return {
                    ...state,
                    cluster: newCluster
                }
            })

        },
        addClusterToStore: (params) => {
            const {newCluster} = params
            set((state) => {
                const newStore = [...state.store, newCluster]
                return {
                    ...state,
                    store: newStore
                }
            })
        },
        removeClusterFromStore: (params) => {
            const {itemIndex} = params
            set((state) => {
                const newStore = state.store.filter((element, elementIndex) => {
                    return elementIndex !== itemIndex
                })
                return {
                    ...state,
                    store: newStore
                }
            })
        },
        emptyStore: () => {
            set((state) => {
                const newStore: never[] = []
                return {
                    ...state,
                    store: newStore
                }
            })
        },
        updateClusterInStore: ({id, updatedCluster}) => set((state) => ({
            store: state.store.map((item) => item.id === id ? {...item, ...updatedCluster} : item)
        })),
    }), {
        name: 'store'
    }
));

export default useStore;
