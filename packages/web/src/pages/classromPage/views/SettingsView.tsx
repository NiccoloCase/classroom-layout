import * as React from "react";
import { ToggleSwitch } from '../../../components/ToggleSwitch';

export const SettingsView: React.FC = () => {
    return (
        <div className="ClassroomPage__SettingsView">
            <h1 className="title">Impostazioni</h1>
            <ToggleSwitch />
        </div>
    );
}