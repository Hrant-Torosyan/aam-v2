import React, { Suspense, useEffect, useState } from "react";
import styles from "./Briefcase.module.scss";
import Products from "src/components/Products/Products";
import Buttons from "src/ui/Buttons/Buttons";
import { useGetBriefcaseCategoriesQuery, useGetBriefcaseProductsMutation } from "src/store/briefcase/briefcaseApi";
import { Project } from "src/types/types";

interface Category {
    name: string;
    count: number;
}

const Briefcase: React.FC = () => {
    const [products, setProducts] = useState<Project[] | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [categories, setCategories] = useState<Category[] | null>(null);

    const { data: categoriesData } = useGetBriefcaseCategoriesQuery();
    const [getProducts] = useGetBriefcaseProductsMutation();

    useEffect(() => {
        if (categoriesData?.categories && Array.isArray(categoriesData.categories)) {
            try {
                const formattedCategories = categoriesData.categories.map((cat: string) => ({
                    name: String(cat),
                    count: 0
                }));

                if (!formattedCategories.find(cat => cat.name === "all")) {
                    formattedCategories.unshift({
                        name: "all",
                        count: 0
                    });
                }

                setCategories(formattedCategories);
            } catch (error) {
                console.error("Error formatting categories:", error);
            }
        }
    }, [categoriesData]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!filter) return;

            try {
                const result = await getProducts(filter).unwrap();
                if (result?.content && Array.isArray(result.content)) {
                    setProducts(result.content);

                    if (categories) {
                        const allProducts = result.content.length;
                        const updatedCategories = [...categories].map(cat => {
                            if (cat.name === "all") {
                                return { ...cat, count: allProducts };
                            }
                            return cat;
                        });
                        setCategories(updatedCategories);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();
    }, [filter, getProducts]);

    const renderLoader = () => (
        <div className={styles.loader}>
            <img
                src="https://i.pinimg.com/originals/92/63/9c/92639cac9c1a0451744f9077ddec0bed.gif"
                alt="loader"
            />
        </div>
    );

    const safeCategories = categories || [];

    return (
        <Suspense fallback={renderLoader()}>
            {safeCategories.length > 0 && products !== null ? (
                <div className={styles.briefcase}>
                    <div className={styles.briefcaseTitle}>
                        <h1>Портфель</h1>
                    </div>
                    {/*<Buttons*/}
                    {/*    categories={safeCategories}*/}
                    {/*    filter={filter}*/}
                    {/*    setFilter={setFilter}*/}
                    {/*/>*/}
                    <Products info={"Briefcase"} products={products} />
                </div>
            ) : (
                renderLoader()
            )}
        </Suspense>
    );
};

export default Briefcase;