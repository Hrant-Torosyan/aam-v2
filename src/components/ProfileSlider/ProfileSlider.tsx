import React from "react";
// import Products from "../Products/Products";

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import styles from "./ProfileSlider.module.scss";

interface ProfileSliderProps {
    products?: any[];
    info?: string;
}

const ProfileSlider: React.FC<ProfileSliderProps> = ({ products = [], info }) => {
    return (
        <div className={styles.profileSliderWrapper}>
            <div className={styles.profileSlider}>
                <h1 className={styles.sliderTitle}>Популярные активы</h1>
                {/*<Products info={"Info"} type="SLIDER" products={products} />*/}
            </div>
        </div>
    );
};

export default ProfileSlider;