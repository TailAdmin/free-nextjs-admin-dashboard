export const AlertBanner = () => {

    const envValue = process.env.NEXT_PUBLIC_ENVIRONMENT;


    return(
        <>
        {(envValue==="production") && (<div className="sticky top-0 z-[100] flex h-banner w-full items-center justify-center gap-3 bg-orange-600  text-white text-sm">
            <span>
                This is production stage. Please, be careful with changing data!
            </span>

        </div>)}

        </>
    );
}
