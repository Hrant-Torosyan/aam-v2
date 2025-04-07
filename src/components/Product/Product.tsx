import React from "react";
import { useNavigate } from "react-router-dom";
import { formatNumber } from "src/utils/formatNumber";
import { useGetProductInfoQuery } from "src/store/product/product";
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
}

const Product: React.FC<ProductProps> = ({
     prod,
     info,
     setProdId,
     handleImageError,
     setHiddenHeader,
     fullWidth = false,
 }) => {
    const navigate = useNavigate();

    const { data: mainData } = useGetProductInfoQuery(prod.projectId || "", {
        skip: !prod.projectId,
    });

    const handleClick = () => {
        const id = info === "Briefcase" ? prod.id : (prod.projectId || "");

        if (id) {
            navigate(`/market/product/${id}`);

            setProdId(id);
            setHiddenHeader("hidden");
        }
    };

    return (
        <div onClick={handleClick} className={`${styles.product} ${fullWidth ? styles.productFull : ""}`}>
            {prod.active !== undefined && (
                prod.active ? (
                    <div className={styles.isAvailable}>
                        <div className={styles.dote}></div>
                        {mainData?.type === "ASSET" ? "Актив" : "Фонд"}
                    </div>
                ) : (
                    <div className={styles.isAvailable}>Не доступно</div>
                )
            )}
            <div className={styles.productImage}>
                <img
                    src={prod.image?.url}
                    alt=""
                    onError={handleImageError}
                />
                <div className={styles.productImageUser}>
                    <img
                        src={mainData?.companyLogo?.url || ""}
                        alt="logo"
                    />
                </div>
            </div>
            <div className={styles.productContent}>
                <h3>{prod.title}</h3>
                <div className={styles.direction}>
                    <h2>{mainData?.productType || ""}</h2>
                    <h2>
                        Страна: <span>{prod.country || ""}</span>
                    </h2>
                </div>
                <div className={styles.hashtags}>
                    {prod.tags && prod.tags.map((item, key) => (
                        <div key={key} className={styles.hashtag}>
                            #{item}
                        </div>
                    ))}
                </div>
                <div className={styles.priceList}>
                    <div className={styles.price}>
                        <p>Цена</p>
                        <span>$ {formatNumber(prod.minPrice || 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;