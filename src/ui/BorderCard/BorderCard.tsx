import React, { ReactNode } from 'react';
import styles from './BorderCard.module.scss';

interface BorderCardProps {
    children: ReactNode;
    className?: string;
}

const BorderCard: React.FC<BorderCardProps> = ({
   children,
   className = ''
}) => {
    return (
        <div className={`${styles.prodInfoCard} ${className}`}>
            {children}
        </div>
    );
};

export default BorderCard;