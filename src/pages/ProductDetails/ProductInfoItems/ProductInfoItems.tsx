import React from "react";
import styles from "./ProductInfoItems.module.scss";

interface ProductInfoItemsProps {
    mainData: {
        name?: string;
        url?: {
            url?: string;
            name?: string;
        };
        [key: string]: any;
    } | null;
}

const ProductInfoItems: React.FC<ProductInfoItemsProps> = ({ mainData }) => {
    // Determine the name to display
    const displayName = mainData?.name || mainData?.url?.name;

    return (
        <div className={styles.productInfoItems}>
            {mainData !== null && (
                <div className={styles.prodInfoCardDownload}>
                    <div className={styles.download}>
                        <svg
                            width="36"
                            height="41"
                            viewBox="0 0 36 41"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M8 0.1875C6.625 0.1875 5.5 1.3125 5.5 2.6875V37.6875C5.5 39.0625 6.625 40.1875 8 40.1875H33C34.375 40.1875 35.5 39.0625 35.5 37.6875V10.1875L25.5 0.1875H8Z"
                                fill="#E2E5E7"
                            />
                            <path
                                d="M28 10.1875H35.5L25.5 0.1875V7.6875C25.5 9.0625 26.625 10.1875 28 10.1875Z"
                                fill="#B0B7BD"
                            />
                            <path d="M35.5 17.6875L28 10.1875H35.5V17.6875Z" fill="#CAD1D8" />
                            <path
                                d="M30.5 32.6875C30.5 33.375 29.9375 33.9375 29.25 33.9375H1.75C1.0625 33.9375 0.5 33.375 0.5 32.6875V20.1875C0.5 19.5 1.0625 18.9375 1.75 18.9375H29.25C29.9375 18.9375 30.5 19.5 30.5 20.1875V32.6875Z"
                                fill="#F15642"
                            />
                            <path
                                d="M5.94922 23.8697C5.94922 23.5397 6.20922 23.1797 6.62797 23.1797H8.93668C10.2367 23.1797 11.4067 24.0497 11.4067 25.7172C11.4067 27.2972 10.2367 28.1772 8.93668 28.1772H7.26797V29.4972C7.26797 29.9372 6.98797 30.1859 6.62797 30.1859C6.29797 30.1859 5.94922 29.9372 5.94922 29.4972V23.8697ZM7.26797 24.4384V26.9284H8.93668C9.60668 26.9284 10.1367 26.3372 10.1367 25.7172C10.1367 25.0184 9.60668 24.4384 8.93668 24.4384H7.26797Z"
                                fill="white"
                            />
                            <path
                                d="M13.3619 30.1858C13.0319 30.1858 12.6719 30.0058 12.6719 29.567V23.8895C12.6719 23.5308 13.0319 23.2695 13.3619 23.2695H15.6507C20.2182 23.2695 20.1182 30.1858 15.7407 30.1858H13.3619ZM13.9919 24.4895V28.967H15.6507C18.3494 28.967 18.4694 24.4895 15.6507 24.4895H13.9919Z"
                                fill="white"
                            />
                            <path
                                d="M21.7411 24.5708V26.1595H24.2898C24.6498 26.1595 25.0098 26.5195 25.0098 26.8683C25.0098 27.1983 24.6498 27.4683 24.2898 27.4683H21.7411V29.567C21.7411 29.917 21.4923 30.1858 21.1423 30.1858C20.7023 30.1858 20.4336 29.917 20.4336 29.567V23.8895C20.4336 23.5308 20.7036 23.2695 21.1423 23.2695H24.6511C25.0911 23.2695 25.3511 23.5308 25.3511 23.8895C25.3511 24.2095 25.0911 24.5695 24.6511 24.5695H21.7411V24.5708Z"
                                fill="white"
                            />
                            <path
                                d="M29.25 33.9375H5.5V35.1875H29.25C29.9375 35.1875 30.5 34.625 30.5 33.9375V32.6875C30.5 33.375 29.9375 33.9375 29.25 33.9375Z"
                                fill="#CAD1D8"
                            />
                        </svg>
                        <p>
                            <span>{displayName}</span>
                        </p>
                    </div>
                    <div className={styles.buttonStyleToo}>
                        <button
                            onClick={() => {
                                if (mainData !== null && mainData?.url?.url) {
                                    const dummyLink = document.createElement("a");
                                    dummyLink.href = mainData.url.url;
                                    dummyLink.setAttribute("target", "_blank");

                                    if (displayName) {
                                        dummyLink.download = displayName;
                                    }

                                    document.body.appendChild(dummyLink);
                                    dummyLink.click();
                                    document.body.removeChild(dummyLink);
                                }
                            }}
                        >
                            <span>Скачать</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductInfoItems;