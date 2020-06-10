import React, { useContext, useEffect, useState, useRef } from 'react';
import * as classnames from "classnames";
import { Link, RouteChildrenProps } from 'react-router-dom';
import "./landingPage.scss";
import { ThemeContext } from '../../context';
import { InputCode } from '../../components/InputCodeComponent';
import { useGetClassroomByIdLazyQuery } from '../../generated/graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import RecentClassroomsSection from './RecentClassroomsSection';
import heroImage from "../../assets/images/landing-hero.svg";
import { SendIdByEmailInput } from '../../components/SendIdByEmailInput';
import { useOutsideClickDetector } from '../../helper';
import { TitleComponent } from '../../components/TitleComponent';

export const LandingPage: React.FC<RouteChildrenProps> = ({ history }) => {
    // context
    const ctx = useContext(ThemeContext);
    const [isEmailPopupOpen, setIsEmailPopupOpen] = useState(false);
    // Rileva quando il client clica al di fuori del pop-up 
    const sendEmailForm = useRef<HTMLDivElement | null>(null);
    useOutsideClickDetector(sendEmailForm, () => setIsEmailPopupOpen(false));
    // GRAPQHL
    const [checkIfClassExists, checkIfClassExistsResponse] = useGetClassroomByIdLazyQuery();
    useEffect(() => {
        ctx.changeNavBarStyle("light");
        return () => ctx.changeNavBarStyle("default");
    }, []);

    useEffect(() => {
        const { data, error } = checkIfClassExistsResponse;
        if (!error && data)
            history.push(`/${data.getClassroomById.id}`);
    }, [checkIfClassExistsResponse]);

    return (
        <div className="LandingPage" >
            <TitleComponent />
            <main className="main-section">
                <div className="left-section">
                    <div className="text-section">
                        <h1 className="headline">Gestisci la tua classe</h1>
                        <p>Registra in pochi passaggi una nuova classe scolastica, mappando la disposizione di ogni singolo banco, e sei subito  pronto a gestire l'aula con facilità. Potrai posizionare a tuo piacere ogni studente per ciasun banco e cambiare i posti casualmente in una frazione di secondo; questo ed altro.</p>
                        <Link className="call-to-action" to="/new">Iniza ora</Link>
                    </div>
                </div>
                <div className="right-section">
                    <img className="hero" src={heroImage} />
                </div>
            </main>
            <RecentClassroomsSection />
            <section className="search-section" id="search">
                <div className="id-form">
                    <h1 className="title">Vai alla tua classe</h1>
                    <div className="search-bar">
                        <span className="search-bar__info">Inserisci l'ID a 9 cifre associato alla classe:</span>
                        <InputCode className="search-bar__input" cellsNumber={9}
                            onCompleted={(id: string) => checkIfClassExists({ variables: { id } })} />
                        <span className="search-bar__error"
                            style={{ opacity: checkIfClassExistsResponse.error ? 1 : 0 }}>
                            <FontAwesomeIcon icon={faExclamationCircle} />
                            L'ID inserito non corrisponde a nessuna classe
                    </span>
                    </div>
                    <button className="id-forgotten" onClick={() => setIsEmailPopupOpen(true)}>
                        ID dimenticato?
                    </button>
                </div>
                <div ref={sendEmailForm}
                    className={classnames("email-form", { popupOpen: isEmailPopupOpen })} >
                    <button className="close-btn" onClick={() => setIsEmailPopupOpen(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <h1 className="title">ID dimenticato?</h1>
                    <SendIdByEmailInput />
                </div>
                <div className="blur" />
            </section>
        </div>
    );
}