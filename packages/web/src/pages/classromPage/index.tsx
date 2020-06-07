import * as React from 'react';
import { HashLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faRandom, faCog, faMap } from '@fortawesome/free-solid-svg-icons';
import "./classroomPage.scss";
import { Route, NavLink, RouteComponentProps, Switch } from "react-router-dom";
import { useGetClassroomByIdQuery, Classroom, Desk } from "../../generated/graphql"
// SCHERMATE
import { MapView } from './views/MapView';
import { EditView } from './views/EditView';
import { ShuffleView } from './views/ShuffleView';
import { SettingsView } from './views/SettingsView';
import { NotFoundView } from '../../components/NotFound';

interface IParams { class_id: string };

export const ClassroomPage: React.FC<RouteComponentProps<IParams>> = props => {
    // classe
    const [classroom, setClassroom] = React.useState<Classroom | undefined>(undefined);
    // GRAPHQL
    const id = props.match.params.class_id;
    const { loading, error, data, refetch } = useGetClassroomByIdQuery({ variables: { id } });

    React.useEffect(() => {
        if (!data) return;
        setClassroom(data.getClassroomById as Classroom);

        // SALVA LA CLASSE CERCATA NELLO STORAGE
        // salvataggi 
        const recentClassrooms = JSON.parse(localStorage.getItem("recent-classrooms") || "[]");
        if (!Array.isArray(recentClassrooms)) return;

        // elimina eventuali copie della stessa classe
        const cl = recentClassrooms.find(c => c.id === id);
        const index = recentClassrooms.indexOf(cl);
        if (index > -1) recentClassrooms.splice(index, 1);

        // aggiunge una nuova classe
        recentClassrooms.unshift({
            name: data.getClassroomById.name,
            email: data.getClassroomById.email,
            id: data.getClassroomById.id
        });

        // limita il numero di classi salvate
        const maxClassrooms = 5;
        if (recentClassrooms.length > maxClassrooms)
            recentClassrooms.length = maxClassrooms;

        // salva le modifiche
        localStorage.setItem("recent-classrooms", JSON.stringify(recentClassrooms));

    }, [data]);

    /**
     * Funzione che viene chimata a seguto del mescolamento dei banchi (studenti)
     */
    const onDesksAreShuffled = (shuffledData: { students?: string[], desks?: Desk[] }) => {
        if (!classroom) return;
        const newClassroom = { ...classroom, ...shuffledData }
        setClassroom(newClassroom);
    }

    /**
     * Schermate della navgazione interna 
     */
    const renderRoutes = (room: Classroom) => (
        <Switch>
            {/* SCHERMATA DELLA MAPPA*/}
            <Route path="/:class_id" exact children={() => (
                <MapView classroom={room} onDesksAreShuffled={onDesksAreShuffled} />)} />
            {/* SCHERMATA DI MODIFICA*/}
            <Route path="/:class_id/edit" exact children={() =>
                <EditView classroom={room} onClassroomIsUpdated={refetch} />} />
            {/* SCHERMATA PER MESCOLARE GLI STUDENTI*/}
            <Route path="/:class_id/shuffle" exact children={() =>
                <ShuffleView classroom={room} onDesksAreShuffled={onDesksAreShuffled} />} />
            {/* SCHERMATA DELLE IMPOSTAZIONI */}
            <Route path="/:class_id/settings" exact children={() => <SettingsView classID={room.id} />} />
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
                    <NavLink to={`/${id}/shuffle`} exact className="navLink"
                        activeClassName="active" title="Mescola gli studenti">
                        <FontAwesomeIcon icon={faRandom} />
                    </NavLink>
                    <NavLink to={`/${id}/edit`} exact className="navLink"
                        activeClassName="active" title="Modifica la classe">
                        <FontAwesomeIcon icon={faEdit} />
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