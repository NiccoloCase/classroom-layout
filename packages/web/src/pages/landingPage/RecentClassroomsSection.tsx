import React, { useEffect, useState, useRef } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faArrowRight, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import ScrollContainer from "react-indiana-drag-scroll";
import { useCallbackRef } from "use-callback-ref";


const RecentClassroomsSection: React.FC<RouteComponentProps> = ({ history }) => {
    const [recentClassrooms, setRecentClassrooms] = useState<any[]>([]);
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() =>
        // imposta le ricerce recenti
        setRecentClassrooms(JSON.parse(localStorage.getItem("recent-classrooms") || "[]"))
        , []);

    // ref
    const wrapper = useRef<HTMLDivElement | null>(null);
    const scrollableContainer = useCallbackRef<ScrollContainer | null>(null, () => {
        if (!scrollableContainer.current) return;
        const element = scrollableContainer.current.getElement();
        // se non c'è un contenuto da scollare elimina la freccia
        setTimeout(() => {
            if (!wrapper.current) return;
            const parentWidth = element.getBoundingClientRect().width;
            const childWidth = wrapper.current.getBoundingClientRect().width;
            if (parentWidth > childWidth) setHasScrolled(true);
        }, 0);
    });

    /**
     * Copia l'ID di una classe
     * @param id 
     */
    const copyIdToClipBoard = (id: string) => {
        const el = document.createElement('textarea');
        el.value = id;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    /**
     * Rimuove una classe dato l'ID tra quelle recenti
     */
    const removeClass = (id: string) => {
        // rimuove la classe 
        const newClassrooms = [...recentClassrooms];
        const cl = newClassrooms.find(c => c.id === id);
        const index = newClassrooms.indexOf(cl);
        if (index > -1) newClassrooms.splice(index, 1);
        // salva le modifiche 
        setRecentClassrooms(newClassrooms);
        localStorage.setItem("recent-classrooms", JSON.stringify(newClassrooms));
    }

    /**
     * Renderizza la card di una classe generica
     */
    const renderClassroomCard = (name: string, email: string, id: string, deleteButtonCallback: () => void) => (
        <div className="classroom" key={id}>
            <div className="left">
                <h3 className="classroom__name">{name}</h3>
                <small className="classroom__id">#{id}</small>
                <span className="classroom__email">{email}</span>
            </div>
            <div className="right">
                <button className="close-btn" onClick={deleteButtonCallback} title="Dimentica">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <button className="copy-btn" onClick={() => copyIdToClipBoard(id)} title="Copia l'ID">
                    <FontAwesomeIcon icon={faCopy} />
                </button>
                <button className="go-btn" onClick={() => history.push(`/${id}`)} title="Vai alla classe">
                    <FontAwesomeIcon icon={faArrowRight} />
                </button>
            </div>
        </div >
    );

    return (
        <>
            {recentClassrooms.length > 0 &&
                <section className="recent-classrooms-section">
                    <h1 className="title">Classi viste recentemente</h1>
                    <div className="wrapper-scroll">
                        {!hasScrolled && <div className="arrow">
                            <FontAwesomeIcon icon={faChevronRight} />
                        </div>}
                        <ScrollContainer
                            className="classrooms-container" ref={scrollableContainer}
                            horizontal={true} vertical={false} onScroll={() => setHasScrolled(true)}>
                            <div className="classrooms" ref={wrapper}>
                                {recentClassrooms.map((c: any, i: number) =>
                                    renderClassroomCard(c.name, c.email, c.id, () => removeClass(c.id)))}
                            </div>
                        </ScrollContainer>
                    </div>
                </section>
            }
        </>
    );
}

export default withRouter(RecentClassroomsSection);