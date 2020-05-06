import * as React from "react";
import * as _ from "lodash";
import classnames from "classnames";
import { TitleComponent } from '../../../../components/TitleComponent';
import { Classroom, MutationEditClassroomArgs, useEditClassroomMutation } from '../../../../generated/graphql';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Desk } from '../../../../components/ClassRoomMap';
// TABS 
import { EditInfoTab } from "./EditInfoTab";
import { EditStudentsTab } from "./EditStudentsTab";
import { EditMapTab } from "./EditMapTab"

export interface TabsEditsErrors {
    name?: boolean;
    email?: boolean;
    students?: boolean;
    desks?: boolean;
}

interface EditViewProps {
    classroom: Classroom;
    /** Funzione chiamata quando vengono salvate le modifiche */
    onClassroomIsUpdated: () => void;
}

export const EditView: React.FC<EditViewProps> = ({ classroom, onClassroomIsUpdated }) => {
    // index della scheda corrente  
    const [tabPage, setTabPage] = React.useState(0);
    // modifiche
    const [edits, setEdits] = React.useState<MutationEditClassroomArgs>(classroom);
    // 
    const [tabsErrors, setTabsErrors] = React.useState<TabsEditsErrors>({});

    // GRAPHQL
    const [editClass] = useEditClassroomMutation();

    /**
     * Invia al server le modifiche
     */
    const submit = async () => {
        // considera soltate i valori che sono stati realmente modificati
        const changes = getOnlyChangedEdits();
        // trasla tutti i banchi alla posizione (0,0)
        if (changes.desks) {
            const desks = Desk.centerDesks(changes.desks);
            changes.desks = Desk.desksToObjs(desks);
        }
        // manda le modifiche all'API
        const { data } = await editClass({ variables: changes });
        if (!data) return;
        onClassroomIsUpdated();
    }

    /**
     * Ripristina tutte le modifiche
     */
    const restore = () => {
        setEdits({ id: classroom.id, name: classroom.name, email: classroom.email, students: classroom.students, desks: classroom.desks });
        setTabsErrors({});
    }

    /**
     * Funzione passata ai componenti figli per
     * aggiungere le modifiche e rimuove / aggiunge gli errori
     */
    const saveEdits = async (changes: MutationEditClassroomArgs, errors?: TabsEditsErrors) => {
        setEdits({ ...edits, ...changes });
        setTabsErrors({ ...tabsErrors, ...errors });
    }

    /**
     * Funzione che restituisce un oggetto di modifiche eliminando tutti quei valori
     * che sono rimasti invariati 
     */
    const getOnlyChangedEdits = () => {
        const changes = { ...edits };
        const changesKeys = Object.keys(changes);
        const changesValues = _.values(changes);
        for (let i = 0; i < changesKeys.length; i++) {
            if (changesKeys[i] === "id") continue;
            let el1 = changesValues[i] as any; // valori delle modifiche
            let el2 = classroom[changesKeys[i]] as any; // valori della classe prima delle modifiche
            if (_.isArray(el1) && _.isArray(el2)) {
                el1 = _.sortBy(el1);
                el2 = _.sortBy(el2);
            }
            // elimina tutti i valori rimasti invariati da prima delle modifiche
            if (_.isEqual(el1, el2)) delete changes[changesKeys[i]];
        }
        return changes;
    }

    /**
     * Verifica che siano state apportate delle verifiche e che queste siano siano valide
     */
    const areChangesValid = (): boolean => {
        // I) controlla che siano state eseguite delle modifiche 
        if (_.isEmpty(getOnlyChangedEdits())) return false;
        // II) controlla che non siao errori passati dai tabs 
        else if (_.values(tabsErrors).indexOf(true) !== -1) return false;
        return true;
    }

    /**
     * Restituisce il titolo del bottone per salvare le modfiche più adeguto
     */
    const getSaveButtonTitle = (): string => {
        // se non stono state apportate modifiche 
        if (_.isEmpty(getOnlyChangedEdits())) return "Non sono ancora state apportate modifiche";
        // se ci sono degli errori
        else if (!areChangesValid()) {
            // conta quanti errori sono presenti
            let errors = 0;
            for (const error in tabsErrors) if (tabsErrors[error]) errors += 1;
            if (errors === 1) return `È presente 1 errore`;
            return `Sono presenti ${errors} errori`;
        }
        return "Salva le modifiche"
    }

    /**
     * Renderizza il contenuto dei tabs
     */
    const renderContent = () => {
        const props = { classroom, edits, sendEdits: saveEdits }
        switch (tabPage) {
            case 0: return <EditInfoTab {...props} />
            case 1: return <EditStudentsTab {...props} />
            case 2: return <EditMapTab {...props} />
            default: return null;
        }
    }

    /**
     * Renderizza i tabs
     */
    const renderTabs = () => {
        const tabsName = ["Dati", "Studenti", "Pianta"];
        const errors = [
            (tabsErrors.name || tabsErrors.email),
            tabsErrors.students,
            tabsErrors.desks
        ];
        return (
            <div className="tabs">
                {tabsName.map((name, index) => (
                    <button onClick={() => setTabPage(index)} key={index}
                        className={classnames("tab", { current: tabPage === index })}>
                        {name} {errors[index] &&
                            <FontAwesomeIcon icon={faExclamationCircle} className="error-mark" />}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="ClassroomPage__EditView">
            <TitleComponent title="Modifica la tua classe" />
            <h3 className="title">Modifica la tua classe:</h3>
            <div className="card">
                <div className="card__tab-menu">
                    {renderTabs()}
                </div>
                <div className="card__content">
                    {renderContent()}
                    <div className="functions">
                        {_.isEmpty(getOnlyChangedEdits()) &&
                            <p className="warning">Non sono state apportate modifiche</p>}
                        <button className="btn" title="Ripristina" onClick={restore}
                            disabled={_.isEmpty(getOnlyChangedEdits())}>
                            ripristina
                        </button>
                        <button className="btn" disabled={!areChangesValid()} title={getSaveButtonTitle()}
                            onClick={submit}>
                            salva
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}