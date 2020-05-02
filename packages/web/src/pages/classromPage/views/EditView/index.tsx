import * as React from "react";
import classnames from "classnames";
import { TitleComponent } from '../../../../components/TitleComponent';
import { Classroom, MutationEditClassroomArgs, useEditClassroomMutation } from '../../../../generated/graphql';
// TABS 
import { EditInfoTab } from "./EditInfoTab";
import { EditStudentsTab } from "./EditStudentsTab";
import { EditMapTab } from "./EditMapTab"

interface EditViewProps {
    classroom: Classroom;
    /** Funzione chiamata quando vengono salvate le modifiche */
    onClassroomIsUpdated: () => void;
}

export const EditView: React.FC<EditViewProps> = ({ classroom, onClassroomIsUpdated }) => {
    // index della scheda corrente  
    const [tabPage, setTabPage] = React.useState(0);
    // GRAPHQL
    const [editClass] = useEditClassroomMutation();

    const renderTabs = () => {
        const tabsName = ["Dati", "Studenti", "Pianta"];
        return (
            <div className="tabs">
                {tabsName.map((name, index) => (
                    <button onClick={() => setTabPage(index)} key={index}
                        className={classnames("tab", { current: tabPage === index })}>
                        {name}
                    </button>
                ))}
            </div>
        );
    }

    const save = async (edits: MutationEditClassroomArgs) => {
        const { data } = await editClass({ variables: edits });
        if (!data) return;
        onClassroomIsUpdated();
    }


    const renderContent = () => {
        switch (tabPage) {
            case 0:
                return <EditInfoTab classroom={classroom} saveEdits={save} />
            case 1:
                return <EditStudentsTab />
            case 2:
                return <EditMapTab classroom={classroom} saveEdits={save} />
            default:
                return null;
        }
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
                </div>
            </div>
        </div>
    );
}
