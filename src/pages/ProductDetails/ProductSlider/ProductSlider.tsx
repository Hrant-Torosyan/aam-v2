import React, { useState, useRef } from "react";
import styles from "./ProductSlider.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Project } from "src/types/types";

const LeftArrow = () => (
    <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1L2 7.5L9 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const RightArrow = () => (
    <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L8 7.5L1 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const CloseIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

interface ProductSliderProps {
    mainData: Project;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ mainData }) => {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [popupVisible, setPopupVisible] = useState<boolean>(false);
    const sliderRef = useRef<Slider | null>(null);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 2,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1.5,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const handlePrevious = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    const handleNext = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const openPopup = () => {
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const handlePopupPrevious = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? (mainData.mediaImages?.length || 1) - 1 : prevIndex - 1
        );
    };

    const handlePopupNext = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === (mainData.mediaImages?.length || 1) - 1 ? 0 : prevIndex + 1
        );
    };

    const handleThumbnailClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <>
            <div className={styles.productSlider}>
                <div className={styles.productSliderActive}>
                    <img
                        src={mainData?.mediaImages?.[activeIndex]?.url?.url}
                        alt={mainData?.mediaImages?.[activeIndex]?.name || `Product image ${activeIndex + 1}`}
                        onClick={openPopup}
                    />
                </div>

                <div className={styles.productSliderThumbnails}>
                    {mainData?.mediaImages && mainData.mediaImages.length > 0 && (
                        <Slider ref={sliderRef} {...settings}>
                            {mainData.mediaImages.map((item, index: number) => (
                                <div key={index}>
                                    <img
                                        className={activeIndex === index ? styles.active : ""}
                                        onClick={() => handleThumbnailClick(index)}
                                        src={item.url?.url || ''}
                                        alt={item.name || `Thumbnail ${index + 1}`}
                                    />
                                </div>
                            ))}
                        </Slider>
                    )}

                    <button className={`${styles.arrow} ${styles.left}`} onClick={handlePrevious}>
                        <LeftArrow />
                    </button>

                    <button className={`${styles.arrow} ${styles.right}`} onClick={handleNext}>
                        <RightArrow />
                    </button>
                </div>
            </div>

            {popupVisible && (
                <div className={styles.popupSlider} onClick={closePopup}>
                    <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                        <button className={`${styles.popupArrow} ${styles.left}`} onClick={handlePopupPrevious}>
                            <LeftArrow />
                        </button>

                        <img
                            src={mainData?.mediaImages?.[activeIndex]?.url?.url}
                            alt={mainData?.mediaImages?.[activeIndex]?.name || `Product image ${activeIndex + 1}`}
                            className={styles.popupImage}
                        />

                        <button className={`${styles.popupArrow} ${styles.right}`} onClick={handlePopupNext}>
                            <RightArrow />
                        </button>

                        <button className={styles.closePopup} onClick={closePopup}>
                            <CloseIcon />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductSlider;