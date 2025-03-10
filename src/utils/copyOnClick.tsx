import React, { useRef, useEffect, ReactNode } from "react";
import ClipboardJS from "clipboard";

interface CopyOnClickProps {
    text: string;
    children: ReactNode;
}

const CopyOnClick: React.FC<CopyOnClickProps> = ({ text, children }) => {
    const textToCopyRef = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (textToCopyRef.current) {
            const clipboard = new ClipboardJS(textToCopyRef.current);
            return () => {
                clipboard.destroy();
            };
        }
    }, []);

    return (
        <span ref={textToCopyRef} data-clipboard-text={text}>
      {children}
    </span>
    );
};

export default CopyOnClick;