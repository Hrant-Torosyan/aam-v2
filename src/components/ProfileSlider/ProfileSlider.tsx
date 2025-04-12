import React, { useEffect, useState, useRef } from "react";
import "swiper/swiper-bundle.css";
import styles from "./ProfileSlider.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import leftArrow from "src/images/svg/leftArrow.svg";
import rightArrow from "src/images/svg/rightArrow.svg";
import Products from "src/components/Products/Products";
import { ProfileProduct, Project } from "src/types/types";
import { useGetProjectsMutation } from "src/store/market/marketAPI";
import Loader from "src/ui/Loader/Loader";

interface ProfileSliderProps {
    products?: ProfileProduct[];
    info?: string;
}

const ProfileSlider: React.FC<ProfileSliderProps> = ({ products = [], info }) => {
    const swiperRef = useRef<SwiperType | null>(null);
    const [displayProducts, setDisplayProducts] = useState<ProfileProduct[]>([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [filter] = useState("all");

    const [getProjects, { data: projectsData, isLoading }] = useGetProjectsMutation();

    useEffect(() => {
        if (!products || products.length === 0) {
            getProjects({ category: filter });
        }
    }, [products, getProjects, filter]);

    useEffect(() => {
        if (products && products.length > 0) {
            setDisplayProducts(products);
            setIsEmpty(false);
        } else if (projectsData) {
            if (projectsData.content && Array.isArray(projectsData.content) && projectsData.content.length > 0) {
                setDisplayProducts(projectsData.content as unknown as ProfileProduct[]);
                setIsEmpty(false);
            } else {
                setDisplayProducts([]);
                setIsEmpty(true);
            }
        }
    }, [products, projectsData]);

    if (isLoading) {
        return <Loader />;
    }

    if (isEmpty || displayProducts.length === 0) {
        return null;
    }

    return (
        <div className={styles.profileSliderWrapper}>
            <div className={styles.profileSlider}>
                <h1 className={styles.sliderTitle}>Популярные активы</h1>

                <div className={styles.sliderWithArrows}>
                    <Swiper
                        onSwiper={(swiper: SwiperType) => (swiperRef.current = swiper)}
                        slidesPerView={"auto"}
                        spaceBetween={20}
                        navigation={false}
                        grabCursor={true}
                        className={styles.swiper}
                    >
                        {displayProducts.map((prod, index) => (
                            <SwiperSlide
                                key={prod.id || index}
                                className={styles.swiperSlide}
                            >
                                <Products
                                    info={info || "Info"}
                                    products={[prod as unknown as Project]}
                                    sliderView={true}
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

export default ProfileSlider;