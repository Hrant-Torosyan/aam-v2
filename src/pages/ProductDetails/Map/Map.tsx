import React, { useEffect, useState } from "react";
import pin from 'src/images/svg/map.svg';
import fullscreen from 'src/images/svg/fullscreen.svg';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./Map.module.scss";
import { Project } from "src/types/types";

declare module "src/types/types" {
    interface Project {
        locationLatitude?: number;
        locationLongitude?: number;
    }
}

interface MapProps {
    mainData: Project;
}

const Map: React.FC<MapProps> = ({ mainData }) => {
    const [mapLoaded, setMapLoaded] = useState(true);

    useEffect(() => {
        const mapContainer = document.getElementById("map");

        if (!mainData?.locationLatitude || !mainData?.locationLongitude || !mapContainer) {
            console.error("Invalid location data or map container.");
            setMapLoaded(false);
            return;
        }

        setMapLoaded(true);

        if ((mapContainer as any)._leaflet_id) {
            (mapContainer as any)._leaflet_id = null;
        }

        const map = L.map("map").setView([mainData.locationLatitude, mainData.locationLongitude], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        L.marker([mainData.locationLatitude, mainData.locationLongitude], {
            icon: L.icon({
                iconUrl: pin,
                iconSize: [30, 30],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40],
            }),
        }).addTo(map);

        const fullscreenControl = new L.Control({ position: "topright" });
        fullscreenControl.onAdd = function () {
            const button = L.DomUtil.create("button", "leaflet-bar");
            const img = L.DomUtil.create("img", "", button);
            img.src = fullscreen;
            img.alt = "Fullscreen";
            img.style.width = "20px";
            img.style.height = "20px";

            button.onclick = () => {
                const mapContainer = map.getContainer();
                if (!document.fullscreenElement) {
                    mapContainer.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            };
            return button;
        };
        fullscreenControl.addTo(map);

        return () => {
            map.remove();
        };
    }, [mainData]);

    if (!mapLoaded) {
        return (
            <div className={styles.map}>
                <h1>Расположение</h1>
                <p>Map data is not available.</p>
            </div>
        );
    }

    return (
        <div className={styles.map}>
            <h1>Расположение</h1>
            <div className={`${styles.mapContainer} ${styles.prodInfoCard}`}>
                <div id="map" style={{ height: "100%", width: "100%" }}></div>
            </div>
        </div>
    );
};

export default Map;