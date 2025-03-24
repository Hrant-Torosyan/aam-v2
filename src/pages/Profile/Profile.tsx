import React, { lazy, useState, useEffect } from "react";

const ProfileEdit = lazy(() => import("./ProfileEdit"));
const MainProfileNew = lazy(() => import("./MainProfile/MainProfile"));

type ProfilePageType = "MainProfileNew" | "ProfileEdit";

const Profile: React.FC = () => {
    const [profilePage, setProfilePage] = useState<ProfilePageType>("MainProfileNew");
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 560);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (isSmallScreen) {
            const parentElement = document.querySelector("main");
            if (parentElement) {
                const padding = profilePage === "MainProfileNew" ? "0" : "";
                parentElement.style.paddingLeft = padding;
                parentElement.style.paddingRight = padding;
            }
        }
    }, [profilePage, isSmallScreen]);

    const handleSetProfilePage = (page: string) => {
        if (page === "MainProfileNew" || page === "ProfileEdit") {
            setProfilePage(page as ProfilePageType);
        } else {
            console.error(`Invalid profile page: ${page}`);
        }
    };


    const CurrentPage = profilePage === "MainProfileNew" ? MainProfileNew : ProfileEdit;

    return (
        <CurrentPage setProfilePage={handleSetProfilePage} />

    );
};

export default Profile;