import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styles from "./Buttons.module.scss";

interface Category {
    name: string;
    count: number;
}

interface ButtonsProps {
    filter: string;
    setFilter: React.Dispatch<React.SetStateAction<string>>;
    categories: Category[];
}

const Buttons: React.FC<ButtonsProps> = ({ filter, setFilter, categories }) => {
    // Make sure allCategory is properly handled
    const allCategory = categories.find((item) => item.name === "all");
    // Default to 0 if not found
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
                                <p>Все</p> <span>{String(prodCount)}</span>
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
                                        <p>{String(category.name)}</p> <span>{String(category.count)}</span>
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

export default Buttons;