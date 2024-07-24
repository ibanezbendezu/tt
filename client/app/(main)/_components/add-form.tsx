'use client';

import React, {Dispatch, SetStateAction, useState} from 'react';
import {useRouter} from "next/navigation";
import {Button} from '@/components/ui/button';
import {
    Form,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import Select from 'react-select';
import {customStyles} from './lib/utils';
import useStore from '@/store/clusters';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {useAuthStore} from '@/store/auth';
import useCart from '@/store/repos';
import {clusterUpdateRequestBySha} from '@/api/server-data';
import {formatDateTime} from '@/lib/utils';

const formSchema = z.object({
    grupo: z.number(),
});

interface AddFormProps {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    cartCollapse: () => void;
}

export default function AddForm({setIsOpen, cartCollapse}: AddFormProps) {
    const router = useRouter();
    const {profile} = useAuthStore(state => state);
    const {cart, emptyCart} = useCart(state => state);
    const {store, updateClusterInStore} = useStore(state => state);
    const clusters = useStore(state => state.store);
    const selectedRepos = useCart(state => state.cart);

    const [showAlert, setShowAlert] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            grupo: 0,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (values.grupo === 0) {
            setShowAlert(true);
            return;
        }

        try {
            const username = profile.username;
            const cluster = store.find(cluster => cluster.id === values.grupo);
            const prevRepos = cluster.repositories;
            const newRepos = cart.map(repo => ({
                name: repo.name,
                owner: repo.owner.login,
            }));
            const repos = [...prevRepos, ...newRepos];

            const data = await clusterUpdateRequestBySha(cluster.sha, repos, username);
            updateClusterInStore({id: values.grupo, updatedCluster: data.data});
            emptyCart();
            setIsOpen(false);
            cartCollapse();
            router.push(`/clusters/${data.data.sha}`);
        } catch (error) {
            console.log(error);
        }
    };

    const options = store.map(cluster => ({
        value: cluster.id,
        label: formatDateTime(cluster.clusterDate),
    }));

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-4 sm:px-0 px-4"
            >
                {showAlert && (
                    <div className="text-red-700 font-mono text-sm px-2 py-1" role="alert">
                        Por favor, selecciona un grupo antes de confirmar.
                    </div>
                )}
                <FormField
                    control={form.control}
                    name="grupo"
                    render={({field: {onChange, value}}) => (
                        <FormItem>
                            <FormLabel>Comparaciones</FormLabel>
                            <Select
                                options={options}
                                styles={customStyles}
                                placeholder="Selecciona un grupo..."
                                value={options.find((option) => option.value === value)}
                                onChange={(option) => {
                                    onChange(option?.value);
                                    setShowAlert(false); // Hide alert on select
                                }}
                            />
                            <FormDescription>
                                Escoge el grupo al que quieres agregar repositorios
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="flex w-full sm:justify-end mt-4">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        <>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    Agregando...
                                </>
                            ) : (
                                'Confirmar'
                            )}
                        </>
                    </Button>
                </div>
            </form>
        </Form>
    );
}