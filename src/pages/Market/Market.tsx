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

// Define type filter constants
const TYPE_FILTERS = {
    ALL: "ALL",
    STOCKS: "STOCKS",
    ASSET: "ASSET",
    FUND: "FUND"
};

// Map for displaying type names in Russian
const TYPE_DISPLAY_NAMES = {
    [TYPE_FILTERS.ALL]: "Все",
    [TYPE_FILTERS.STOCKS]: "Акции",
    [TYPE_FILTERS.ASSET]: "Актив",
    [TYPE_FILTERS.FUND]: "Фонд"
};

// Default type to use when no type is selected
const DEFAULT_TYPE = TYPE_FILTERS.ASSET; // Changed back to ASSET as default to match original behavior

const Market: React.FC = () => {
    const [products, setProducts] = useState<Project[] | null>(null);
    const [filter, setFilter] = useState<string>("all");
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [selectedType, setSelectedType] = useState<string>(DEFAULT_TYPE);
    const [hasInteracted, setHasInteracted] = useState<boolean>(false);
    const [hiddenHeader, setHiddenHeader] = useState<boolean>(false);
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

    const [getProjects, { isLoading: isProjectsLoading }] = useGetProjectsMutation();

    // Get categories based on selected type (ALL type should get all categories)
    // For ALL we send empty string which the API should interpret as "no filter"
    const effectiveTypeForCategories = selectedType === TYPE_FILTERS.ALL ? "" : selectedType;
    const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery(effectiveTypeForCategories);

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
                // Special handling for ALL case - we're not sending the type parameter at all
                // This lets the API return all products regardless of type
                const params = selectedType === TYPE_FILTERS.ALL ?
                    {
                        category: filter !== "all" ? filter : undefined,
                        title: undefined
                    } :
                    {
                        category: filter !== "all" ? filter : undefined,
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

    // Improved type change handler
    const handleTypeChange = (type: string) => {
        setSelectedType(type);
        setFilter("all"); // Reset category filter when changing types
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

    const handleSetHiddenHeader = (value: string) => {
        setHiddenHeader(value === "hidden");
    };

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
                                    {/* Type filter buttons */}
                                    {Object.entries(TYPE_FILTERS).map(([key, value]) => (
                                        <button
                                            key={value}
                                            onClick={() => handleTypeChange(value)}
                                            className={
                                                (!hasInteracted && value === DEFAULT_TYPE) ||
                                                selectedType === value ?
                                                    styles.active : ""
                                            }
                                        >
                                            {TYPE_DISPLAY_NAMES[value]}
                                        </button>
                                    ))}
                                </div>
                                <Search
                                    category={filter}
                                    type={selectedType === TYPE_FILTERS.ALL ? "" : selectedType}
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