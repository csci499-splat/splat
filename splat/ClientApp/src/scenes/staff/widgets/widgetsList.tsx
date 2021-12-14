import React from 'react';

import SetCurrentMessage from './SetCurrentMessage';

export type Widget = {
    title: string;
    size: {
        width: number | string;
        height: number | string;
    };
    innerContent: React.ReactElement;
};

const widgetsList: Widget[] = [
    {
        title: 'Set Current Message',
        size: {
            width: '100%',
            height: 300,
        },
        innerContent: <SetCurrentMessage />,
    },
];

export { widgetsList };