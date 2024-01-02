import Link from "next/link";
const OptionsLayout = ({
                            children,
                        }: {
    children: React.ReactNode
}) => {
    return (
        <div className={'m-8'}>
            <div>
                <Link href={'/'} className={"text-white"}>Back</Link>
            </div>
            {children}
        </div>
    );
}

export default OptionsLayout;