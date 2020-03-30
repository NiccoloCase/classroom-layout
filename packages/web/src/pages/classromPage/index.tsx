import * as React from 'react';
const { useState, useRef, useEffect } = React;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHistory, faCog, faMap } from '@fortawesome/free-solid-svg-icons';
import "./classroomPage.scss";
import { Route, NavLink, RouteComponentProps } from "react-router-dom";
import { MapView } from './views/MapView';
import { EditView } from './views/EditView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { useGetClassroomByIdQuery } from "../../generated/graphql"
import { HashLoader } from 'react-spinners';
import { NotFoundView } from '../../components/NotFound';

interface IParams { class_id: string };

export const ClassroomPage: React.FC<RouteComponentProps<IParams>> = props => {
    // dimensioni del canvas
    const [canvasDimensions, setCanvasDimensions] = useState<{ width?: number, height?: number }>({});
    // contenitore 
    const contentContainer = useRef<HTMLDivElement>(null);
    // GRAPHQL
    const id = props.match.params.class_id;
    const { loading, error, data } = useGetClassroomByIdQuery({ variables: { id } });
    const name = data ? data.getClassroomById.name : null;
    const students = data ? data.getClassroomById.students : null;
    const desks = data ? data.getClassroomById.desks : null;

    useEffect(() => {
        setClassroomDimensions();
        window.addEventListener('resize', setClassroomDimensions);
        return () => window.removeEventListener('resize', setClassroomDimensions);
    }, [data])

    /**
     * Imposta le dimensioni del canvas
     */
    const setClassroomDimensions = () => {
        if (!contentContainer.current) return;
        const { width, height } = contentContainer.current.getBoundingClientRect();
        const offset = 100;
        setCanvasDimensions({ width: width - offset, height: height - offset });
    }

    /**
     * Disegna il riquadro degli studenti
     */
    const renderStudents = () => {
        if (!students) return;
        const cards = students.map((student, index) => (
            <div className="student" key={index}>
                <div className="thumbnail" >
                    {student[0] + student[1]}
                </div>
                <p>{student}</p>
            </div>
        ));
        return (
            <div className="students">
                <h4 className="section-title">{students.length} studenti:</h4>
                <div className="students-container">
                    {cards}
                </div>
            </div>
        );
    }

    /**
     * Schermata principale
     */
    const mainView = (
        <React.Fragment>
            <div className="left-menu">
                <div className="navLinks">
                    <NavLink to={`/${id}/`} exact className="navLink"
                        activeClassName="active"
                        title="Mappa della classe" >
                        <FontAwesomeIcon icon={faMap} />
                    </NavLink>
                    <NavLink to={`/${id}/edit`} exact className="navLink"
                        activeClassName="active" title="Modifica i posti">
                        <FontAwesomeIcon icon={faEdit} />
                    </NavLink>
                    <NavLink to={`/${id}/history`} exact className="navLink"
                        activeClassName="active" title="Cronologia">
                        <FontAwesomeIcon icon={faHistory} />
                    </NavLink>
                    <NavLink to={`/${id}/settings`} exact className="navLink"
                        activeClassName="active" title="Impostazioni">
                        <FontAwesomeIcon icon={faCog} />
                    </NavLink>
                </div>
            </div>
            <div className="content" ref={contentContainer}>
                <Route path="/:class_id" exact component={() => (<MapView
                    desks={desks!} students={students!}
                    canvasWidth={canvasDimensions.width}
                    canvasHeight={canvasDimensions.height}
                />)} />
                <Route path="/:class_id/edit" exact component={EditView} />
                <Route path="/:class_id/history" exact component={HistoryView} />
                <Route path="/:class_id/settings" exact component={SettingsView} />
            </div>
            <div className="right-menu">
                <div className="classroom-info">
                    <h2>CLASSE</h2>
                    <h3 className="classroom-name">{name}</h3>
                    <h4 className="classroom-id">{`#${id}`}</h4>
                </div>
                {renderStudents()}
            </div>
        </React.Fragment>
    );

    /**
     * Schermata in caso di errore
     */
    const renderErrorView = () => {
        if (!error) return;
        const err = error.graphQLErrors[0];
        // la classe non è stata trovata
        if (err.extensions && err.extensions.exception.status === 404)
            return (
                <div className="content">
                    <NotFoundView />
                </div>
            );
        // errore sconosciuto
        return (
            <div className="content">
                <h1>C'è stato un errore, riprova piu'tardi</h1>
            </div>
        );
    }

    /**
     * Schermata di caricamento
     */
    const loadingView = (
        <div className="content">
            <HashLoader color="#dadfe1" />
        </div>
    );

    const renderCorrectView = () => {
        if (error) return renderErrorView();
        else if (loading || !data) return loadingView;
        return mainView;
    }

    return (
        <div className="ClassroomPage">
            {renderCorrectView()}
        </div>
    );
}




