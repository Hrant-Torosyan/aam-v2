import React, { useRef } from "react";
import styles from "./Products.module.scss";
import Product from "../Product/Product";
import leftArrow from "src/images/svg/leftArrow.svg";
import rightArrow from "src/images/svg/rightArrow.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Project } from "@/types/types";

interface ProductsProps {
    info: string;
    products: Project[];
    type?: "LIST" | "SLIDER";
    hiddenHeader?: boolean;
    setHiddenHeader?: (value: string) => void;
    onSelectProduct?: (id: string) => void;
    handleImageError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    sliderView?: boolean;
}

const Products: React.FC<ProductsProps> = ({
   products,
   info,
   type = "LIST",
   hiddenHeader = false,
   setHiddenHeader = () => {},
   onSelectProduct = () => {},
   handleImageError = (event) => {
       event.currentTarget.onerror = null;
       event.currentTarget.src = "https://flagsapi.com/RU/flat/64.png";
   },
   sliderView = false,
}) => {
    const swiperRef = useRef<SwiperType | null>(null);

    const handleSelectProduct = (id: string) => {
        console.log("Products - Selected product:", id);
        if (id) {
            onSelectProduct(id);
            setHiddenHeader("hidden");
        }
    };

    const productsList = Array.isArray(products) ? products : [];

    return (
        <>
            <div className={hiddenHeader ? `${styles.products} ${styles.hidden}` : styles.products}>
                {type === "LIST" ? (
                    productsList.length > 0 ? (
                        productsList.map((prod, key) => (
                            <Product
                                key={key}
                                prod={prod}
                                info={info}
                                projectId={prod.projectId || prod.id}
                                setProdId={(id) => {
                                    if (onSelectProduct) {
                                        onSelectProduct(id);
                                    }
                                    setHiddenHeader("hidden");
                                }}
                                handleImageError={handleImageError}
                                setHiddenHeader={setHiddenHeader}
                                sliderView={sliderView}
                            />
                        ))
                    ) : (
                        <div className={styles.notProd}>
                            {info === "Briefcase"
                                ? "Ваш портфель пока пуст. Начните инвестировать прямо сейчас!"
                                : "В магазине не найдено продуктов"}
                        </div>
                    )
                ) : (
                    <div className={styles.profileSlid}>
                        <Swiper
                            onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
                            slidesPerView={"auto"}
                            navigation={false}
                            grabCursor={true}
                        >
                            {productsList.length > 0 ? (
                                productsList.map((prod, index) => (
                                    <SwiperSlide key={prod.projectId || prod.id || index}>
                                        <Product
                                            fullWidth={true}
                                            key={index}
                                            prod={prod}
                                            info={info}
                                            projectId={prod.projectId || prod.id}
                                            setProdId={handleSelectProduct}
                                            handleImageError={handleImageError}
                                            setHiddenHeader={setHiddenHeader}
                                        />
                                    </SwiperSlide>
                                ))
                            ) : (
                                <div className={styles.noProductsMessage}>
                                    {info === "Briefcase"
                                        ? "Ваш портфель пока пуст. Начните инвестировать прямо сейчас!"
                                        : "В магазине не найдено продуктов"}
                                </div>
                            )}
                        </Swiper>
                        {productsList.length > 0 && (
                            <>
                                <button
                                    onClick={() => swiperRef.current?.slidePrev()}
                                    className={`${styles.customArrow} ${styles.prevArrow}`}
                                >
                                    <img src={leftArrow} alt="Previous" />
                                </button>
                                <button
                                    onClick={() => swiperRef.current?.slideNext()}
                                    className={`${styles.customArrow} ${styles.nextArrow}`}
                                >
                                    <img src={rightArrow} alt="Next" />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default Products;