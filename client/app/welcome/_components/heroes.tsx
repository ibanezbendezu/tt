import Image from "next/image";

export const Heroes = () => {
    return (
        <div className="flex flex-col items-center justify-center max-w-5xl">
            <div className="flex items-center">
                <div className="relative w-[120px] h-[120px] sm:w-[145px] sm:h-[145px] md:w-[180px] md:h-[180px]">
                    <Image
                        src="/mascot.png"
                        fill
                        sizes="(max-width: 768px) 120px, (max-width: 1024px) 145px, 180px"
                        className="object-contain dark:hidden"
                        alt="Mascot"
                    />
                    <Image
                        src="/mascot.png"
                        fill
                        sizes="(max-width: 768px) 120px, (max-width: 1024px) 145px, 180px"
                        className="object-contain hidden dark:block"
                        alt="Mascot"
                    />
                </div>
            </div>
        </div>
    );
};
