import React, { ReactNode } from "react";
import "./FAQPage.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { SendIdByEmailInput } from '../../components/SendIdByEmailInput';

interface IQuestion {
    text: string;
    content: ReactNode;
}

export const FAQPage = () => {

    const renderQuestion = ({ text, content }: IQuestion, index: number) => (
        <div className="accordion-item">
            <input id={`question-${index}`} type="checkbox" className="accordion-toggle" />
            <label className="accordion-question" htmlFor={`question-${index}`}>
                {text}
                <FontAwesomeIcon icon={faChevronLeft} />
            </label>
            <div className="accordion-answer">
                <div className="accordion-content">
                    {content}
                </div>
            </div>
        </div>
    );

    const questions: IQuestion[] = [
        {
            text: "Ho perso l'ID della mia classe, come faccio?",
            content: <SendIdByEmailInput />
        },
        {
            text: "Quante classi posso registrare con una email?",
            content: (
                <p>È possibile registrare una sola classe per email.</p>
            )
        },
        {
            text: "Cosa rischio se registro una classe con una email non esistente?",
            content: (
                <p>Al momento non effettuammo in fase di registrazione controlli in merito alla validità e al reale possesso delle email. Tuttavia è interesse del consumatore fornire un’email veritiera al fine di avere sempre la possibilità di recuperare l’ID della classe correlata se perso e di usufruire di altri vantaggi.</p>
            )
        },
        {
            text: "Quanti studenti può ospitare una classe?",
            content: (
                <p>La tua classe può essere composta da un minimo di 2 a un massimo di 30 studenti ogni dei quali deve essere identificato da un appellativo dalla lunghezza tra i 3 e i 20 caratteri.</p>
            )
        },
    ];

    return (
        <div className="FAQPage">
            <div className="container">
                <h1 className="title">Domande frequenti</h1>
                <div className="accordion">
                    {questions.map((question, index) => renderQuestion(question, index))}
                </div>
            </div>
        </div>
    );
}