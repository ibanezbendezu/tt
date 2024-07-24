'use client';

import React, {Dispatch, SetStateAction} from 'react';
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
import Select from 'react-select'
import {customStyles} from './lib/utils';
import useStore from '@/store/clusters';
import {zodResolver} from '@hookform/resolvers/zod';
import {Loader2} from 'lucide-react';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {useAuthStore} from '@/store/auth';
import useCart from '@/store/repos';
import {clusterUpdateRequest} from '@/api/server-data';
import {formatDateTime} from '@/lib/utils';


const formSchema = z.object({
    grupo: z.number()
});

export default function AddForm({
                                    setIsOpen,
                                }: {
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const router = useRouter();
    const {profile} = useAuthStore(state => state);
    const {cart, emptyCart} = useCart(state => state);
    const {store, updateClusterInStore} = useStore(state => state);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            grupo: 0
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log(values);
            const username = profile.username;
            const cluster = store.find(cluster => cluster.id === values.grupo);
            const prevRepos = cluster.repositories;
            const newRepos = cart.map(repo => ({
                name: repo.name,
                owner: repo.owner.login
            }));
            const repos = [...prevRepos, ...newRepos];

            const data = await clusterUpdateRequest(values.grupo, repos, username);
            updateClusterInStore({id: values.grupo, updatedCluster: data.data});
            emptyCart();
            setIsOpen(false);
            router.push(`/clusters/${data.data.id}`);
        } catch (error) {
            console.log(error);
        }
    };

    const options = store.map(cluster => ({
        value: cluster.id,
        label: formatDateTime(cluster.clusterDate)
    }));

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-4 sm:px-0 px-4"
            >
                <FormField
                    control={form.control}
                    name="grupo"
                    render={({field: {onChange, value}}) => (
                        <FormItem>
                            <FormLabel>Grupos</FormLabel>
                            <Select
                                options={options}
                                styles={customStyles}
                                placeholder="Selecciona un grupo..."
                                value={options.find((option) => option.value === value)}
                                onChange={(option) => onChange(option?.value)}
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
