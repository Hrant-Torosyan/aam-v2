import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./ProductDetails.module.scss";
import { useGetProductInfoQuery } from "src/store/product/product";
import Loader from "src/ui/Loader/Loader";

interface ProductDetailsProps {
    prodId?: string;
    onClose?: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ prodId, onClose }) => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>("details");

    const id = prodId || productId || "";

    const { data: product, isLoading, error } = useGetProductInfoQuery(id, {
        skip: !id
    });

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            navigate('/market');
        }
    };

    if (isLoading) {
        return (
            <Loader />
        );
    }

    if (error || !product) {
        return (
            <div className={styles.error}>
                <h3>Не удалось загрузить информацию о продукте</h3>
                <button onClick={handleClose}>Вернуться к списку</button>
            </div>
        );
    }

    return (
        <div className={styles.productDetails}>
            <div className={styles.header}>
                <button onClick={handleClose} className={styles.backButton}>
                    <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 1L1 6L6 11" stroke="#0E1A32" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Назад</span>
                </button>
                <h1>{product.title}</h1>
                {(product as any).profit && <div className={styles.profit}>+{(product as any).profit}%</div>}
            </div>


        </div>
    );
};

export default ProductDetails;