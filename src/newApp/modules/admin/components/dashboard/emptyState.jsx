import React from 'react';
import { List } from '@rsuite/icons';
import { Panel } from 'rsuite';

const EmptyState = () => (
    <div 
        className="flex justify-center items-center h-full bg-gray-100" 
        style={{ minHeight: '300px' }}
    >
        <Panel 
            bordered 
            style={{ 
                width: '600px', 
                padding: '24px', 
                background: '#fff', 
                borderRadius: '8px' 
            }}
            className="text-center shadow-lg"
        >
            <div className="flex justify-center mb-4">
                <List 
                    style={{ 
                        fontSize: 60, 
                        color: '#007bff' 
                    }} 
                />
            </div>
            <h4 className="mb-2 text-lg font-medium">No Contributions Found</h4>
            <p className="text-gray-600 mb-4">
                You currently have no contributions in the system. Once added, they will appear here.
            </p>
        </Panel>
    </div>
);

export default EmptyState;
