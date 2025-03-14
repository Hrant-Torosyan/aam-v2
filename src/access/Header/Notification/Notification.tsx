import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import webstomp from "webstomp-client";
import { useGetNotificationsQuery } from "src/store/auth/authAPI";
import styles from "../Header.module.scss";

interface NotificationProps {
    setIsActiveSelectHeader: React.Dispatch<React.SetStateAction<boolean>>;
    notification: boolean;
    setNotification: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenSc: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccessInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NotificationItem {
    notificationId: string;
    title: string;
    content: string;
    readDate: string | null;
}

const Notification: React.FC<NotificationProps> = ({
   setIsActiveSelectHeader,
   notification,
   setNotification,
   setIsOpenSc,
   setSuccessInfo,
}) => {
    const { data: notifications, refetch } = useGetNotificationsQuery({});
    const [limitNotification, setLimitNotification] = useState(3);
    const [remainingTime, setRemainingTime] = useState(1200);
    const [notificationInfo, setNotificationInfo] = useState<string | null>(null);
    const [checkWallet, setCheckWallet] = useState(false);

    const notificationRef = useRef<HTMLDivElement | null>(null);

    // Get wallet status from localStorage or another source if needed
    useEffect(() => {
        const userAuth = JSON.parse(localStorage.getItem("userAuth") || "{}");
        setCheckWallet(!!userAuth.walletConnected);
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (checkWallet) {
            interval = setInterval(() => {
                setRemainingTime((prev) => (prev > 1 ? prev - 1 : 0));
            }, 1000);
        } else {
            setRemainingTime(1200);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [checkWallet]);

    useEffect(() => {
        if (remainingTime === 0) {
            setIsOpenSc(true);
            setSuccessInfo(false);
        }
    }, [remainingTime, setIsOpenSc, setSuccessInfo]);

    useEffect(() => {
        const socket = new SockJS("http://145.223.99.13:8080/aam-websocket");
        const stompClient = webstomp.over(socket);

        stompClient.connect({}, () => {
            const userId = JSON.parse(localStorage.getItem("userAuth") || "{}").id;
            stompClient.subscribe(`/topic/messages.${userId}`, (message) => {
                const msg = JSON.parse(message.body);
                if (msg.type === "USER_DEPOSIT") {
                    setIsOpenSc(true);
                    setSuccessInfo(true);
                }
                setNotificationInfo(msg.notificationId);
                refetch();
            });
        });

        return () => {
            if (stompClient.connected) stompClient.disconnect();
        };
    }, [setIsOpenSc, setSuccessInfo, refetch]);

    const handleNotificationClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsActiveSelectHeader(false);

        // Simply toggle notification visibility without marking as read
        setNotification(!notification);
        if (!notification) {
            setNotificationInfo(null);
        }
    };

    const toggleNotificationLimit = (e: React.MouseEvent) => {
        e.stopPropagation();
        setLimitNotification((prev) => (prev === 3 ? 10 : 3));
    };

    return (
        <div
            ref={notificationRef}
            className={`${styles.notification} ${notification ? styles.activeNotification : styles.unActiveNotification} ${
                notificationInfo ? styles.active : ""
            }`}
            onClick={handleNotificationClick}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width={28} height={28} fill="none">
                <rect width={28} height={28} fill="#348EF1" fillOpacity={0.1} rx={6} />
                <path
                    stroke="#348EF1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M14 6.91c2.76 0 5 1.41 5 4.17 0 1.61.58 3.43 1.19 4.86.5 1.2-.34 2.64-1.64 2.64H9.44c-1.3 0-2.14-1.44-1.64-2.64.61-1.43 1.2-3.25 1.2-4.86 0-2.76 2.23-4.17 5-4.17Zm2.5 11.67v.83c0 1.38-1.12 2.09-2.5 2.09-1.39 0-2.5-.71-2.5-2.09"
                />
            </svg>
            <div className={styles.notificationItem}>
                {notifications?.totalElements ? (
                    notifications.content.slice(0, limitNotification).map((item: NotificationItem) => (
                        <div
                            className={`${styles.notificationItemBlock} ${
                                item.readDate === null ? styles.active : ""
                            }`}
                            key={item.notificationId}
                        >
                            <h3>
                                <div className={styles.dote}></div>
                                {item.title}
                            </h3>
                            <p>{item.content}</p>
                        </div>
                    ))
                ) : (
                    <p className={styles.notMsg}>Пока пусто</p>
                )}
                {notifications?.totalElements && notifications.totalElements > 3 && (
                    <button onClick={toggleNotificationLimit}>
                        {limitNotification === 3 ? "смотреть полностью" : "скрыть"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default Notification;