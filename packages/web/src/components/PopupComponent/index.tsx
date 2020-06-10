import React, { useRef } from "react";
import classnames from "classnames";
import "./PopupComponent.scss";
import { useOutsideClickDetector } from '../../helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface PopupProps {
    className?: string;
    title: string;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export const Popup: React.FC<PopupProps> = ({ children, isOpen, setIsOpen, title, className }) => {
    const popup = useRef<HTMLDivElement | null>(null);
    useOutsideClickDetector(popup, () => setIsOpen(false));

    return (
        <>
            <div className={classnames("PopupComponent", className, { popupOpen: isOpen })} ref={popup}>
                <div className="PopupComponent__header">
                    <h1 className="PopupComponent__title">{title}</h1>
                    <button className="PopupComponent__close-btn" title="Chiudi"
                        onClick={() => setIsOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                {children}
            </div>
            <div className="PopupComponent-blur" />
        </>
    );
}