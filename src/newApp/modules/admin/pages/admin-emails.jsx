import React, { useState, useRef } from 'react';
import { Button, IconButton, Modal, Panel, Stack, Table, Tag } from "rsuite";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle} from '../components/ui/dialogue'
import Column from "rsuite/esm/Table/TableColumn";
import { Cell, HeaderCell } from "rsuite-table";
import { FaRotateLeft, FaTrash, FaPlus } from "react-icons/fa6";
import moment from "moment";
import { BASE_URL } from '../../../../config';
import newRequest from '../../../../utils/newRequest';
import { toast } from 'react-toastify';

const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [emailTags, setEmailTags] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const response = await newRequest.get(`${BASE_URL}admin/getEmails`);
      const data = await response.data;
      setEmails(data);
    } catch (error) {
      console.error('No deletes or Error fetching emails:', error);
    }
    setIsLoading(false);
  };

  const handleOpen = () => {
    setEmailTags([]);
    setOpenCreateModal(true);
  };
  
  const handleClose = () => {
    setEmailTags([]);
    setCurrentEmail('');
    setOpenCreateModal(false);
  };

  const extractEmails = (text) => {
    // This regex will match email patterns and handle various separators
    const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    const matches = text.match(emailPattern) || [];
    return [...new Set(matches)]; // Remove duplicates
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const extractedEmails = extractEmails(pastedText);
    
    // Filter out invalid emails and already added ones
    const validNewEmails = extractedEmails.filter(email => 
      emailRegex.test(email) && !emailTags.includes(email)
    );

    if (validNewEmails.length > 0) {
      setEmailTags([...emailTags, ...validNewEmails]);
      setCurrentEmail('');
    }

    if (extractedEmails.length !== validNewEmails.length) {
      toast.warning(`${extractedEmails.length - validNewEmails.length} invalid or duplicate emails were skipped`);
    }
  };

  const handleAddEmailTag = () => {
    if (!currentEmail) return;
    
    if (!emailRegex.test(currentEmail)) {
      toast.error('Invalid email format');
      return;
    }

    if (emailTags.includes(currentEmail)) {
      toast.error('Email already added');
      return;
    }

    setEmailTags([...emailTags, currentEmail]);
    setCurrentEmail('');
  };

  const handleRemoveEmailTag = (emailToRemove) => {
    setEmailTags(emailTags.filter(email => email !== emailToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEmailTag();
    }
  };

  const handleAddSingleEmail = async (email) => {
    try {
      const response = await newRequest.post(`${BASE_URL}admin/addEmail`, { email }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 200) {
        toast.success(`Email ${email} added successfully!`);
        setEmailTags(emailTags.filter(e => e !== email));
        await fetchEmails();
      }
    } catch (error) {
      console.error('Error adding email:', error);
      toast.error(`Failed to add email: ${email}`);
    }
  };

  const handleAddAllEmails = async () => {
    if (emailTags.length === 0) {
      toast.error('Please add at least one email');
      return;
    }

    try {
      const promises = emailTags.map(email =>
        newRequest.post(`${BASE_URL}admin/addEmail`, { email }, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      await Promise.all(promises);
      toast.success(`${emailTags.length} email(s) added successfully!`);
      handleClose();
      fetchEmails();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await newRequest.delete(`${BASE_URL}admin/deleteEmail/${id}`);
      
      if (response.status === 200) {
        toast.success('Email successfully deleted!');
        fetchEmails();
      }
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  const confirmDelete = (id) => {
    setEmailToDelete(id);
    setOpenDialog(true);
  };

  React.useEffect(() => {
    fetchEmails();
  }, []);

  return (
    <>
      <Panel
        bordered
        header={
          <Stack justifyContent="space-between">
            <div>
              <h1 className="font-bold text-2xl leading-6">Email List</h1>
              <p className="text-xs text-gray-500 font-normal">
                Manage the list of emails
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <IconButton
                icon={<FaRotateLeft />}
                disabled={isLoading}
                onClick={fetchEmails}
              />
              <Button
                onClick={handleOpen}
                appearance="primary"
              >
                Ajouter
              </Button>
            </div>
          </Stack>
        }
        style={{ height: 'calc(90vh - 100px)', overflowY: 'auto' }}
      >
        <Table
          height={Math.max(400, window.innerHeight - 250)}
          data={emails}
          showHeader
          loading={isLoading}
        >
          <Column width={50} align="center">
            <HeaderCell>#</HeaderCell>
            <Cell>
              {(rowData, rowIndex) => <span>{rowIndex + 1}</span>}
            </Cell>
          </Column>
          <Column flexGrow={1}>
            <HeaderCell>Email</HeaderCell>
            <Cell style={{ padding: "6px" }}>
              {(item) => (
                <div className="flex flex-col">
                  <span>{item.email}</span>
                  <span className="text-xs text-gray-500">{item._id}</span>
                </div>
              )}
            </Cell>
          </Column>
          <Column width={150}>
            <HeaderCell>Created on</HeaderCell>
            <Cell style={{ padding: "6px" }}>
              {(item) => moment(item.createdAt).format("lll")}
            </Cell>
          </Column>
          <Column width={80}>
            <HeaderCell>Actions</HeaderCell>
            <Cell style={{ padding: "6px" }}>
              {(rowData) => (
                <IconButton
                  icon={<FaTrash />}
                  color="red"
                  appearance="subtle"
                  onClick={() => confirmDelete(rowData._id)}
                />
              )}
            </Cell>
          </Column>
        </Table>
      </Panel>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: 'red' }}>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="text-center">
            <p>
              Be careful! If you click delete, the email, user, and their document will be removed.
            </p>
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <Button
              appearance="primary"
              style={{ backgroundColor: 'red', color: 'white' }}
              onClick={() => {
                handleDelete(emailToDelete);
                setOpenDialog(false);
              }}
            >
              Delete
            </Button>
            <Button onClick={() => setOpenDialog(false)} appearance="subtle">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Modal
        open={openCreateModal}
        onClose={handleClose}
        backdrop
        overflow
        size="sm"
      >
        <Modal.Header>
          <Modal.Title>Add multiple emails at once</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onPaste={handlePaste}
                  placeholder="Enter email address or paste multiple emails"
                  className="block flex-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <IconButton
                  icon={<FaPlus />}
                  appearance="primary"
                  onClick={handleAddEmailTag}
                />
              </div>
              
              <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-gray-50 rounded-md">
                {emailTags.map((email, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleRemoveEmailTag(email)}
                    className="mr-2 mb-2"
                  >
                    <span className="mr-2">{email}</span>
                    <Button
                      appearance="link"
                      size="xs"
                      onClick={() => handleAddSingleEmail(email)}
                    >
                      Add
                    </Button>
                  </Tag>
                ))}
                {emailTags.length === 0 && (
                  <div className="text-gray-400 text-sm">
                    No emails added yet. Type an email and press Enter, click the plus button, or paste multiple emails.
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleAddAllEmails}
            appearance="primary"
            disabled={emailTags.length === 0}
          >
            Add All ({emailTags.length})
          </Button>
          <Button
            onClick={handleClose}
            appearance="subtle"
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmailList;