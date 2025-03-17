import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./Diagram.module.scss";

type DiagramProps = {
    percentage: number;
};

const Diagram: React.FC<DiagramProps> = ({ percentage }) => {
    return (
        <div className={styles.progressLvl}>
            <CircularProgressbar
                styles={buildStyles({
                    textColor: "#2c73f3",
                    pathColor: "#2c73f3",
                    trailColor: "#2c72f347",
                })}
                value={percentage}
                text={`${percentage}%`}
            />
        </div>
    );
};

export default Diagram;