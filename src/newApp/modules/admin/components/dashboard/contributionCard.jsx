import React, { useState } from 'react';
import { VStack, Button, Modal } from 'rsuite';
import ArrowDownIcon from '@rsuite/icons/ArrowDown';

const ContributionCard = ({ contribution, onToggle, isExpanded }) => {
  const [showNoteModal, setShowNoteModal] = useState(false);

  return (
    <div className="w-full">
      <div 
        className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-medium text-lg">{contribution.name}</h3>
            <p className="text-gray-600">{contribution.faculty}</p>
            <p className="text-gray-600">{contribution.field}</p>
            <p className="text-sm text-gray-500">
              Last contribution: {new Date(contribution.lastContributionDate).toLocaleDateString()}
            </p>
          </div>
          <ArrowDownIcon 
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            style={{ fontSize: 20 }}
          />
        </div>
      </div>

      {isExpanded && (
        <div className="mt-2 p-4 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-3">Contribution History</h4>
          {contribution.history.map((item, index) => (
            <div key={index} className="mb-4 p-3 bg-white rounded border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{item.fileName}</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    appearance="subtle"
                    onClick={() => setShowNoteModal(true)}
                  >
                    View Note
                  </Button>
                  <Button 
                    appearance="primary"
                    className="flex items-center"
                  >
                    <Document className="w-4 h-4 mr-2" />
                    Open PDF
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      <Modal open={showNoteModal} onClose={() => setShowNoteModal(false)}>
        <Modal.Header>
          <Modal.Title>Note Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="whitespace-pre-wrap">{contribution.note}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowNoteModal(false)} appearance="subtle">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ContributionCard;