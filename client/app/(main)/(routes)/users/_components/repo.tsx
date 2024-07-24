import {FaRegStar} from "react-icons/fa";
import {FaCodeFork} from "react-icons/fa6";
import {PROGRAMMING_LANGUAGES} from "@/lib/utils";
import {useState, useEffect} from "react";
import useCart from './../../../../../store/repos';
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import Image from "next/image";


const Repo = ({repo}: { repo: any }) => {
    const {cart, addItemToCart, removeItemFromCart} = useCart();

    const isRepoInCart = cart.some(item => item.id === repo.id);
    const [isSelected, setIsSelected] = useState(isRepoInCart);

    useEffect(() => {
        setIsSelected(isRepoInCart);
    }, [cart, isRepoInCart]);

    const handleSelectionChange = () => {
        if (!isSelected) {
            const alreadyInCart = cart.some(item => item.id === repo.id);
            if (!alreadyInCart) {
                addItemToCart({newItem: repo});
            }
        } else {
            const itemIndex = cart.findIndex((item) => item.id === repo.id);
            if (itemIndex !== -1) {
                removeItemFromCart({itemIndex});
            }
        }
        setIsSelected(!isSelected);
    };


    return (
        <Card>
            <div className="flex justify-between items-center">
                <CardHeader>
                    <CardTitle>
                        <a
                            href={repo.html_url}
                            target='_blank'
                            rel='noreferrer'
                            className='hover:underline text-sm font-semibold'
                        >
                            {repo.name}
                        </a>
                    </CardTitle>
                    <CardDescription className='text-xs font-light'>
                        {repo.description ? repo.description.slice(0, 500) : "No se proporciona descripción\n"}
                    </CardDescription>
                </CardHeader>
                <input className="-translate-x-3 -translate-y-4" type="checkbox" checked={isSelected}
                       onChange={handleSelectionChange}/>
            </div>
            <CardFooter>
                <div className="flex gap-2 items-center">
                    <Badge variant="muted">
                        <FaRegStar/> {repo.stargazers_count}
                    </Badge>
                    <Badge variant="muted">
                        <FaCodeFork/> {repo["forks_count"]}
                    </Badge>
                    <div className='flex items-center gap-1 pl-1'>
                        {repo.language && (
                            <div className='font-normal text-xs'>
                                {repo.language}
                            </div>
                        )}
                        {PROGRAMMING_LANGUAGES[repo.language as keyof typeof PROGRAMMING_LANGUAGES] ? (
                            <Image src={PROGRAMMING_LANGUAGES[repo.language as keyof typeof PROGRAMMING_LANGUAGES]}
                                 alt='Programming language icon' width={20} height={20} layout='fixed'/>
                        ) : null}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};
export default Repo;