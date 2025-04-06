import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styles from "./CategoriesButtons.module.scss";

interface Category {
    id: string;
    name: string;
    count: number;
}

interface CategoriesButtonsProps {
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    categories: Category[];
}

const CategoriesButtons: React.FC<CategoriesButtonsProps> = ({ filter, setFilter, categories }) => {
    const allCategory = categories.find((item) => item.name === "all");
    const prodCount = allCategory ? allCategory.count : 0;

    return (
        <div className={styles.buttons}>
            <Swiper slidesPerView={"auto"} navigation grabCursor={true}>
                {prodCount > 0 && (
                    <SwiperSlide>
                        <div
                            onClick={() => {
                                setFilter("all");
                            }}
                            className={styles.button}
                        >
                            <button className={filter === "all" ? styles.active : ""}>
                                <p>Все</p> <span>{prodCount}</span>
                            </button>
                        </div>
                    </SwiperSlide>
                )}

                {categories.map((category, key) => {
                    if (category.name !== "all") {
                        return (
                            <SwiperSlide key={key}>
                                <div
                                    onClick={() => {
                                        setFilter(category.name);
                                    }}
                                    className={styles.button}
                                >
                                    <button className={filter === category.name ? styles.active : ""}>
                                        <p>{category.name}</p> <span>{category.count}</span>
                                    </button>
                                </div>
                            </SwiperSlide>
                        );
                    }
                    return null;
                })}
            </Swiper>
        </div>
    );
};

export default CategoriesButtons;