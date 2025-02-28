import { Suspense } from "react";
import Loader from "src/ui/Loader/Loader";

const LayoutRoot = ({ children }: any) => {
    return (
        <>
            <Suspense
                fallback={
                    <Loader />
                }
            >
                {children}
            </Suspense>
        </>
    );
};

export default LayoutRoot;
