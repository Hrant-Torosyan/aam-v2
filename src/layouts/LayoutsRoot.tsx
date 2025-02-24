import { Suspense } from "react";

const LayoutRoot = ({ children }: any) => {
    return (
        <>
            <Suspense
                fallback={
                    <div className="loader">
                        <img
                            src="https://i.pinimg.com/originals/92/63/9c/92639cac9c1a0451744f9077ddec0bed.gif"
                            alt="loader"
                        />
                    </div>
                }
            >
                {children}
            </Suspense>
        </>
    );
};

export default LayoutRoot;
