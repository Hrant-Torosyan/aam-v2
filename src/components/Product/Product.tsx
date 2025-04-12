import React from "react";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "src/utils/formatNumber";
import { useGetProductInfoQuery } from "src/store/product/productApi";
import { Project } from "@/types/types";
import styles from "../Products/Products.module.scss";

interface ProductProps {
    prod: Project;
    info: string;
    setProdId: (id: string) => void;
    handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    setHiddenHeader: (value: string) => void;
    fullWidth?: boolean;
    projectId?: string;
    sliderView?: boolean;
}

const Product: React.FC<ProductProps> = ({
     prod,
     info,
     setProdId,
     handleImageError,
     setHiddenHeader,
     fullWidth = false,
     projectId,
     sliderView = false,
 }) => {
    const navigate = useNavigate();

    const { data: mainData } = useGetProductInfoQuery(prod.projectId || "", {
        skip: !prod.projectId,
    });

    const handleClick = () => {
        const id = info === "Briefcase" ? prod.id : (prod.projectId || "");

        if (id) {
            setProdId(id);
            setHiddenHeader("hidden");
            navigate(`/market/product/${id}`);
        }
    };

    // Determine CSS classes with appropriate fallbacks
    const productClass = styles.product || "";
    const productFullClass = styles.productFull || "";
    const isAvailableClass = styles.isAvailable || "";
    const doteClass = styles.dote || "";
    const productImageClass = styles.productImage || "";
    const productImageUserClass = styles.productImageUser || "";
    const productContentClass = styles.productContent || "";
    const directionClass = styles.direction || "";
    const hashtagsClass = styles.hashtags || "";
    const hashtagClass = styles.hashtag || "";
    const priceListClass = styles.priceList || "";
    const priceClass = styles.price || "";
    const sliderProductClass = styles.sliderProduct || "";

    // Set CSS classes based on whether in slider view or not
    const containerClass = `${productClass} ${
        sliderView ? sliderProductClass : fullWidth ? productFullClass : ""
    }`;

    return (
        <div onClick={handleClick} className={containerClass}>
            {prod.active !== undefined && (
                prod.active ? (
                    <div className={isAvailableClass}>
                        <div className={doteClass}></div>
                        {mainData?.type === "ASSET" ? "Актив" : "Фонд"}
                    </div>
                ) : (
                    <div className={isAvailableClass}>Не доступно</div>
                )
            )}
            <div className={productImageClass}>
                <img
                    src={prod.image?.url}
                    alt=""
                    onError={handleImageError}
                />
                <div className={productImageUserClass}>
                    <img
                        src={mainData?.companyLogo?.url || ""}
                        alt="logo"
                    />
                </div>
            </div>
            <div className={productContentClass}>
                <h3>{prod.title}</h3>
                <div className={directionClass}>
                    <h2>{mainData?.productType || ""}</h2>
                    <h2>
                        Страна: <span>{prod.country || ""}</span>
                    </h2>
                </div>
                <div className={hashtagsClass}>
                    {prod.tags && prod.tags.map((item, key) => (
                        <div key={key} className={hashtagClass}>
                            #{item}
                        </div>
                    ))}
                </div>
                <div className={priceListClass}>
                    <div className={priceClass}>
                        <p>Цена</p>
                        <span>$ {formatNumber(prod.minPrice || 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;