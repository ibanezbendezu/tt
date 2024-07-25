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
import { CustomAlert } from './custom-alert';

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

    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState(0);
    const [reposToAdd, setReposToAdd] = useState<any[]>([]);
    const [clusterSha, setClusterSha] = useState('');
    const [isBUttonDisabled, setIsButtonDisabled] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            grupo: 0,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onValidate = (values: z.infer<typeof formSchema>) => {
        const cluster = store.find(cluster => cluster.id === values.grupo);
        setClusterSha(cluster.sha);
        
        const prevRepos = cluster.repositories;
        const newRepos = cart.map(repo => ({
            name: repo.name,
            owner: repo.owner.login,
        }));

        const existingRepos = newRepos.filter(newRepo =>
            prevRepos.some((prevRepo: { name: any; owner: any; }) => 
                prevRepo.name === newRepo.name && prevRepo.owner === newRepo.owner
            )
        );

        const reposToAdd = newRepos.filter(newRepo =>
            !prevRepos.some((prevRepo: { name: any; owner: any; }) => 
                prevRepo.name === newRepo.name && prevRepo.owner === newRepo.owner
            )
        );

        if (existingRepos.length === newRepos.length) {
            setAlertType(2);
            setShowAlert(true);
            setIsButtonDisabled(false);
            return;
        } else if (existingRepos.length > 0) {
            setReposToAdd([...reposToAdd, ...prevRepos]);
            setAlertType(3);
            setShowAlert(true);
            setIsButtonDisabled(true);
            return;
        } else {
            setReposToAdd([...reposToAdd, ...prevRepos]);
            setAlertType(4);
            setShowAlert(true);
            setIsButtonDisabled(true);
            return;
        }
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (values.grupo === 0) {
            setShowAlert(true);
            setAlertType(1);
            return;
        }
        
        try {
            const username = profile.username;
            const data = await clusterUpdateRequestBySha(clusterSha, reposToAdd, username);
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
                    <CustomAlert option={alertType}/>
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
                                    setShowAlert(false);
                                    onValidate({grupo: option?.value});
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
                        disabled={isLoading || !isBUttonDisabled}
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