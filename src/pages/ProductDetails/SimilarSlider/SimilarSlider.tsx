import React, { useRef } from "react";
import "swiper/swiper-bundle.css";
import styles from "./SimilarSlider.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import leftArrow from "src/images/svg/leftArrow.svg";
import rightArrow from "src/images/svg/rightArrow.svg";
import Products from "src/components/Products/Products";
import { Project } from "@/types/types";

interface SimilarSliderProps {
    products: Project[];
    prodId?: string;
    setProdId: (id: string) => void;
    handleImageError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    setHiddenHeader?: (value: string) => void;
    setMainData?: (data: any) => void;
    info?: {
        tags: string[];
    };
    sliderView?: boolean; // Make it optional with default value
}

const SimilarSlider: React.FC<SimilarSliderProps> = ({
                                                         products = [],
                                                         prodId,
                                                         setProdId,
                                                         handleImageError,
                                                         setHiddenHeader,
                                                         sliderView = true // Default to true since this IS a slider
                                                     }) => {
    const swiperRef = useRef<SwiperType | null>(null);

    const filteredProducts = products.filter(
        (p) => p.id !== prodId && p.projectId !== prodId
    );

    if (!filteredProducts.length) return null;

    const handleImageErrorSafe = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (handleImageError) {
            handleImageError(e);
        } else {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://flagsapi.com/RU/flat/64.png";
        }
    };

    const handleProductClick = (id: string) => {
        setProdId(id);
        setHiddenHeader?.("hidden");
        window.scrollTo({ top: 0 });
    };

    return (
        <div className={styles.similarSliderWrapper}>
            <div className={styles.profileSlider}>
                <h1 className={styles.sliderTitle}>Похожие проекты</h1>

                <div className={styles.sliderWithArrows}>
                    <Swiper
                        onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
                        slidesPerView={"auto"}
                        spaceBetween={20}
                        navigation={false}
                        grabCursor={true}
                        className={styles.swiper}
                    >
                        {filteredProducts.map((prod, index) => (
                            <SwiperSlide
                                key={prod.projectId || index}
                                className={styles.swiperSlide}
                            >
                                <Products
                                    info="Market"
                                    products={[prod]}
                                    hiddenHeader={false}
                                    setHiddenHeader={setHiddenHeader}
                                    onSelectProduct={handleProductClick}
                                    handleImageError={handleImageErrorSafe}
                                    sliderView={true} // Add a new prop to indicate this is being rendered in slider
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className={`${styles.customArrow} ${styles.prevArrow}`}
                        type="button"
                    >
                        <img src={leftArrow} alt="Previous" />
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className={`${styles.customArrow} ${styles.nextArrow}`}
                        type="button"
                    >
                        <img src={rightArrow} alt="Next" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SimilarSlider;