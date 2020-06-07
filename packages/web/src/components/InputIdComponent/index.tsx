import React, { useState, useRef, KeyboardEvent } from "react";
import * as classnames from "classnames";
import * as styles from "./InputId.module.scss";

interface InputIdProps {
    cellsNumber: number;
    className?: string;
    /** Funzione chiamata quando tutte le caselle sono state riempite */
    onCompleted?: (value: string) => void;
}

export const InputId: React.FC<InputIdProps> = ({ cellsNumber, className, onCompleted }) => {
    const input = useRef<HTMLInputElement | null>(null);
    const [value, setValue] = useState("");
    const values = value.split("");
    const [focused, setFocused] = useState(false);
    const cells = new Array(cellsNumber).fill(0);

    /**
     * Funzione chiamata quando viene cliccato l'input  
     */
    const handleClick = () => {
        if (input.current) input.current.focus();
    };

    /**
     * Funzione chiamata quando viene digitato un carattere
     */
    const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
        const targetValue = e.currentTarget.value;
        if (value.length < cells.length) {
            const newValue = (value + targetValue).slice(0, cells.length)
            setValue(newValue);
            // chiama il callback se ogni cella è stata riempita
            if (newValue.length === cells.length && typeof onCompleted === "function")
                onCompleted(newValue);
        }
    };

    /**
     * Funzione chiamata alla pressione di un tasto 
     */
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace")
            setValue(value.slice(0, value.length - 1));
    };

    // index della cella selezionata 
    const selectedIndex = values.length < cells.length ? values.length : cells.length - 1;
    // se ogni cella è stata completata 
    const hideInput = !(values.length < cells.length);
    // Dimneisoni (in rem):
    const cellOffset = 0.3;
    const cellWidth = 2;
    const cellHeight = 2.5;

    return (
        <div className={classnames([styles.wrap, className])} onClick={handleClick}>
            <input
                value=""
                ref={input}
                className={styles.input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    fontSize: `${cellWidth}rem`,
                    width: `${cellWidth}rem`,
                    top: "0px",
                    bottom: "0px",
                    left: `${selectedIndex * (cellWidth + cellOffset)}rem`,
                    opacity: hideInput ? 0 : 1,
                }}
            />
            {cells.map((v, index) => {
                // se la cella è selezionata 
                const selected = values.length === index;
                const filled = values.length === cells.length && index === cells.length - 1;

                return (
                    <div className={styles.display} key={index} style={{
                        width: `${cellWidth}rem`,
                        height: `${cellHeight}rem`,
                        fontSize: `${cellWidth}rem`,
                        marginRight: `${cellOffset}rem`
                    }}>
                        {values[index]}
                        {(selected || filled) && focused && <div className={styles.shadows} />}
                    </div>
                );
            })}
        </div>
    )
}