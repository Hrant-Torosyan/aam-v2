import React, { Suspense, useEffect, useState } from "react";
import styles from "./Market.module.scss";
import Search from "./Search";
import CategoriesButtons from "src/ui/CategoriesButtons/CategoriesButtons";
import { useGetProjectsMutation, useGetCategoriesQuery } from "src/store/market/marketAPI";
import { Project } from "@/types/types";
import Products from "src/components/Products/Products";
import ProductDetails from "src/pages/ProductDetails/ProductDetails";
import Loader from "src/ui/Loader/Loader";

interface Category {
    id: string;
    name: string;
    count: number;
}

interface DataResponse {
    data: Project[];
}

const Market: React.FC = () => {
    const [products, setProducts] = useState<Project[] | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [selectedType, setSelectedType] = useState<string>("ASSET");
    const [hasInteracted, setHasInteracted] = useState<boolean>(false);
    const [hiddenHeader, setHiddenHeader] = useState<boolean>(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const [getProjects, { isLoading: isProjectsLoading }] = useGetProjectsMutation();
    const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery(selectedType);

    useEffect(() => {
        if (categoriesData?.data) {
            const isIdFormat = categoriesData.data[0] && 'id' in categoriesData.data[0];

            let formattedCategories: Category[] = [];

            if (isIdFormat) {
                formattedCategories = categoriesData.data.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    count: 0
                }));
            } else {
                formattedCategories = (categoriesData.data as unknown as Array<{name: string, count: number}>).map(cat => ({
                    id: cat.name,
                    name: cat.name,
                    count: cat.count || 0
                }));
            }

            const hasAllCategory = formattedCategories.some(cat => cat.name === "all");
            if (!hasAllCategory) {
                formattedCategories.unshift({
                    id: "all",
                    name: "all",
                    count: formattedCategories.reduce((sum, cat) => sum + (cat.count || 0), 0)
                });
            }

            setCategories(formattedCategories);
        }
    }, [categoriesData]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const params = {
                    category: filter !== "all" ? filter : null,
                    type: selectedType,
                    title: undefined
                };

                const response = await getProjects(params).unwrap();

                if (response && 'content' in response) {
                    setProducts(response.content as Project[]);

                    if (categories && filter === "all") {
                        const updatedCategories = [...categories];
                        const allCategoryIndex = updatedCategories.findIndex(cat => cat.name === "all");
                        if (allCategoryIndex !== -1) {
                            updatedCategories[allCategoryIndex] = {
                                ...updatedCategories[allCategoryIndex],
                                count: (response as any).totalElements || response.content.length
                            };
                            setCategories(updatedCategories);
                        }
                    }
                }
                else if ('data' in response) {
                    const dataResponse = response as unknown as DataResponse;
                    setProducts(dataResponse.data);

                    if (categories && filter === "all") {
                        const updatedCategories = [...categories];
                        const allCategoryIndex = updatedCategories.findIndex(cat => cat.name === "all");
                        if (allCategoryIndex !== -1) {
                            updatedCategories[allCategoryIndex] = {
                                ...updatedCategories[allCategoryIndex],
                                count: dataResponse.data.length
                            };
                            setCategories(updatedCategories);
                        }
                    }
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProducts([]);
            }
        };

        fetchProducts();
    }, [filter, selectedType, getProjects, categories]);

    const handleTypeChange = (type: string) => {
        setSelectedType(type);
        setFilter("all");
        setHasInteracted(true);
    };

    const handleSearchResults = (results: any) => {
        if (results && 'content' in results) {
            setProducts(results.content as Project[]);
        }
        else if (results && 'data' in results) {
            setProducts((results as DataResponse).data);
        } else {
            setProducts([]);
        }
    };

    const handleProductSelect = (id: string) => {
        setSelectedProductId(id);
        setHiddenHeader(true);
    };

    const handleCloseDetails = () => {
        setSelectedProductId(null);
        setHiddenHeader(false);
    };

    // This is the function you'll pass to components that need to modify the header visibility
    const handleSetHiddenHeader = (value: string) => {
        setHiddenHeader(value === "hidden");
    };

    // For image error handling in child components
    const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = "https://flagsapi.com/RU/flat/64.png";
    };

    const isLoading = isProjectsLoading || isCategoriesLoading;

    return (
        <Suspense fallback={<Loader />}>
            {isLoading ? (
                <Loader />
            ) : (
                <div className={styles.market}>
                    {!hiddenHeader && (
                        <>
                            <div className={styles.filterBlock}>
                                <div className={styles.marketTitle}>
                                    <h1>Маркет</h1>
                                </div>
                                <div className={styles.switcher}>
                                    <button
                                        onClick={() => handleTypeChange("ASSET")}
                                        className={!hasInteracted || selectedType === "ASSET" ? styles.active : ""}
                                    >
                                        Активы
                                    </button>
                                    <button
                                        onClick={() => handleTypeChange("FUND")}
                                        className={selectedType === "FUND" ? styles.active : ""}
                                    >
                                        Фонды
                                    </button>
                                </div>
                                <Search
                                    category={filter}
                                    type={selectedType}
                                    onResultsChange={handleSearchResults}
                                />
                            </div>
                            {categories && !hiddenHeader && (
                                <CategoriesButtons
                                    categories={categories}
                                    filter={filter}
                                    setFilter={setFilter}
                                />
                            )}
                        </>
                    )}

                    {selectedProductId ? (
                        <ProductDetails
                            prodId={selectedProductId}
                            onClose={handleCloseDetails}
                            handleImageError={handleImageError}
                            setHiddenHeader={handleSetHiddenHeader}
                        />
                    ) : (
                        products && products.length > 0 ? (
                            <Products
                                info={"Market"}
                                products={products}
                                hiddenHeader={hiddenHeader}
                                setHiddenHeader={handleSetHiddenHeader}
                                onSelectProduct={handleProductSelect}
                                handleImageError={handleImageError}
                            />
                        ) : (
                            !isLoading && (
                                <div className={styles.notProd || ""}>
                                    В магазине не найдено продуктов
                                </div>
                            )
                        )
                    )}
                </div>
            )}
        </Suspense>
    );
};

export default Market;