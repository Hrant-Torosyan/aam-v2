import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProductDetails.module.scss";
import { useGetProductInfoQuery } from "src/store/product/product";
import { useFilterByTagsMutation } from "src/store/market/marketAPI";
import Loader from "src/ui/Loader/Loader";
import AboutCompany from "./AboutCompany/AboutCompany";
import ProductSlider from "./ProductSlider/ProductSlider";
import UserInfo from "./UserInfo/UserInfo";
import DetailsOfFund from "./DetailsOfFund/DetailsOfFund";
import Presentation from "./Presentation/Presentation";
import Team from "./Team/Team";
import Video from './Video/Video';
import Documents from './Documents/Documents';
import Map from './Map/Map';
import Investors from './Investors/Investors';
import SimilarSlider from './SimilarSlider/SimilarSlider';
import { Project } from "src/types/types";

interface ProductDetailsProps {
    prodId?: string;
    onClose?: () => void;
    handleImageError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    setHiddenHeader?: (value: string) => void;
}

interface PresentationData {
    presentations: Array<{
        url?: {
            url?: string;
            name?: string;
        };
    }>;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
   prodId,
   onClose,
   handleImageError: externalHandleImageError,
   setHiddenHeader: externalSetHiddenHeader
}) => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [popUpProdNew, setPopUpProdNew] = useState<string | false>(false);
    const [profileProducts, setProfileProducts] = useState<Project[]>([]);

    const id = prodId || productId || "";

    const { data: product, isLoading, error } = useGetProductInfoQuery(id, {
        skip: !id
    });

    const [filterByTags, { data: similarProductsData }] = useFilterByTagsMutation();

    useEffect(() => {
        if (product && product.tags && product.tags.length > 0) {
            filterByTags(product.tags);
        }
    }, [product, filterByTags]);

    useEffect(() => {
        if (similarProductsData && similarProductsData.content) {
            setProfileProducts(similarProductsData.content);
        }
    }, [similarProductsData]);

    const handleClose = () => {
        if (externalSetHiddenHeader) {
            externalSetHiddenHeader("");
        }

        if (onClose) {
            onClose();
        } else {
            navigate('/market');
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (externalHandleImageError) {
            externalHandleImageError(e);
        } else {
            e.currentTarget.src = '/placeholder-image.jpg';
        }
    };

    const setHiddenHeader = (value: string) => {
        if (externalSetHiddenHeader) {
            externalSetHiddenHeader(value);
        }
    };

    const setProdId = (newId: string) => {
        if (newId !== id) {
            navigate(`/market/product/${newId}`);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    if (error || !product) {
        return (
            <div className={styles.error}>
                <h3>Не удалось загрузить информацию о продукте</h3>
                <button onClick={handleClose}>Вернуться к списку</button>
            </div>
        );
    }

    const presentationData: PresentationData = {
        presentations: product.presentations?.map(pres => ({
            url: pres.url
        })) || []
    };

    return (
        <div className={styles.productInfo}>
            <div className={styles.productInfoTitle}>
                <button onClick={handleClose}>
                    <svg
                        width="7"
                        height="12"
                        viewBox="0 0 7 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M6 1L1 6L6 11"
                            stroke="#0E1A32"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>Назад</span>
                </button>
                <h1>{product.title}</h1>
                {product.profit && <div className={styles.percent}>+{product.profit}%</div>}
            </div>

            <div className={styles.productInfoContent}>
                <div className={styles.productInfoItem}>
                    <ProductSlider mainData={product} />

                    <div className={`${styles.productInfoUserConent} ${styles.contentMobile}`}>
                        <UserInfo
                            mainData={product}
                            setPopUpProdNew={setPopUpProdNew}
                        />
                    </div>
                    <DetailsOfFund mainData={product} />
                    {product.companyDescription && (
                        <AboutCompany mainData={{
                            financialIndicatorContent: product.companyDescription,
                            mediaImages: product.mediaImages
                        }} />
                    )}
                    {presentationData.presentations.length > 0 && (
                        <Presentation mainData={presentationData} />
                    )}
                    {(product.ceoPosition || product.ceoLastname || product.ceoFirstname || product.ceoImage?.url || product.employeesContent) && (
                        <Team
                            prodId={id}
                            ceoPosition={product.ceoPosition}
                            ceoLastname={product.ceoLastname}
                            ceoFirstname={product.ceoFirstname}
                            ceoImage={product.ceoImage?.url}
                            employeesContent={product.employeesContent}
                        />
                    )}
                    {product.mediaVideo && <Video mainData={product} />}
                    {product.documents && product.documents.length > 0 && <Documents mainData={product} />}
                    {(product.locationLatitude || product.locationLongitude) && <Map mainData={product} />}
                    {product.type !== "ASSET" && <Investors prodId={id} mainData={product} />}
                    {profileProducts?.length > 0 && (
                        <SimilarSlider
                            handleImageError={handleImageError}
                            setHiddenHeader={setHiddenHeader}
                            setProdId={setProdId}
                            prodId={id}
                            products={profileProducts}
                            info={{
                                tags: product.tags || [],
                            }}
                            sliderView={true}
                        />
                    )}
                </div>

                <div className={styles.productInfoUserConent}>
                    <UserInfo
                        mainData={product}
                        setPopUpProdNew={setPopUpProdNew}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;