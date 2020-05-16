import * as React from 'react';
import { HashLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faHistory, faCog, faMap } from '@fortawesome/free-solid-svg-icons';
import "./classroomPage.scss";
import { Route, NavLink, RouteComponentProps, Switch } from "react-router-dom";
import { useGetClassroomByIdQuery, Classroom } from "../../generated/graphql"
// SCHERMATE
import { MapView } from './views/MapView';
import { EditView } from './views/EditView';
import { HistoryView } from './views/HistoryView';
import { SettingsView } from './views/SettingsView';
import { NotFoundView } from '../../components/NotFound';

interface IParams { class_id: string };

export const ClassroomPage: React.FC<RouteComponentProps<IParams>> = props => {
    // classe
    const [classroom, setClassroom] = React.useState<Classroom | undefined>(undefined);
    // GRAPHQL
    const id = props.match.params.class_id;
    const { loading, error, data, refetch } = useGetClassroomByIdQuery({ variables: { id } });

    // GRAOHQL
    React.useEffect(() => {
        if (data) setClassroom(data.getClassroomById as Classroom | undefined);
    }, [data]);

    /**
     * Funzione che viene chimata a seguto del mescolamento dei banchi (studenti)
     */
    const onDesksAreShuffled = (shuffledStudents: string[]) => {
        if (!classroom) return;
        const newClassroom = { ...classroom }
        newClassroom.students = shuffledStudents;
        setClassroom(newClassroom);
    }

    /**
     * Schermate della navgazione interna 
     */
    const renderRoutes = (room: Classroom) => (
        <Switch>
            <Route path="/:class_id" exact children={() => (
                <MapView classroom={room} onDesksAreShuffled={onDesksAreShuffled} />)} />
            <Route path="/:class_id/edit" exact children={() =>
                <EditView classroom={room} onClassroomIsUpdated={refetch} />}
            />
            <Route path="/:class_id/history" exact children={HistoryView} />
            <Route path="/:class_id/settings" exact children={SettingsView} />
        </Switch>
    );

    /**
     * Schermata principale
     */
    const renderMainView = (room: Classroom) => (
        <React.Fragment>
            {/* MENU LATERALE DI SINISTRA */}
            <div className="left-menu">
                <div className="navLinks">
                    <NavLink to={`/${id}/`} exact className="navLink"
                        activeClassName="active"
                        title="Mappa della classe" >
                        <FontAwesomeIcon icon={faMap} />
                    </NavLink>
                    <NavLink to={`/${id}/edit`} exact className="navLink"
                        activeClassName="active" title="Modifica la classe">
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
            {/* CONTENUTO */}
            <div className="content"> {renderRoutes({ ...room, id })} </div>
        </React.Fragment>
    );

    /**
     * Schermata in caso di errore
     */
    const renderErrorView = () => {
        if (!error) return;
        const err = error.graphQLErrors[0];
        // la classe non è stata trovata
        if (err && err.extensions && err.extensions.exception.status === 404)
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
        else if (loading || !classroom) return loadingView;
        return renderMainView(classroom);
    }

    return (
        <div className="ClassroomPage">
            {renderCorrectView()}
        </div>
    );
}