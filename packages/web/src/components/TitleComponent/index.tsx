import React from 'react';
import { Helmet } from 'react-helmet';
import config from "@crl/config";

interface ITitleComponentProps { title?: string; }

const TitleComponent: React.FC<ITitleComponentProps> = ({ title }) => {
    const defaultTitle = config.APP_NAME;
    return (
        <Helmet>
            <title>{title ? title : defaultTitle}</title>
        </Helmet>
    );
};

export { TitleComponent };