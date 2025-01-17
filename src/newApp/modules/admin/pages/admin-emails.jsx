import React, { useState, useRef } from 'react';
import { Button, IconButton, Modal, Panel, Stack, Table } from "rsuite";
import Column from "rsuite/esm/Table/TableColumn";
import { Cell, HeaderCell } from "rsuite-table";
import { FaRotateLeft, FaTrash } from "react-icons/fa6";
import moment from "moment";
import { BASE_URL } from '../../../../config';
import newRequest from '../../../../utils/newRequest';
import { toast } from 'react-toastify';
const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef();

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const response = await newRequest.get(`${BASE_URL}admin/getEmails`);
      const data = await response.data;
      setEmails(data);

    } catch (error) {
      console.error('Error fetching emails:', error);
    }
    setIsLoading(false);
  };

  const handleOpen = () => setOpenCreateModal(true);
  const handleClose = () => {
    emailRef.current.value = "";
    setOpenCreateModal(false);
  };

  const handleCreate = async () => {
    try {
      const response = await newRequest.post(`${BASE_URL}admin/addEmail`,{email:emailRef.current.value}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.statusCode === 200) {
        toast.success('Email added successfully!');
        handleClose();
        fetchEmails();
      }
    } catch (error) {
      console.error('Error adding email:', error);
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
              <h1 className="font-bold text-2xl leading-6">Liste des Emails</h1>
              <p className="text-xs text-gray-500 font-normal">
                Gérer la liste des emails
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
      >
        <Table
          data={emails}
          showHeader
          loading={isLoading}
        >
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
            <HeaderCell>Créer le</HeaderCell>
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
                  onClick={() => handleDelete(rowData._id)}
                />
              )}
            </Cell>
          </Column>
        </Table>
      </Panel>

      <Modal
        open={openCreateModal}
        onClose={handleClose}
        backdrop
        overflow
      >
        <Modal.Header>
          <Modal.Title>Ajouter un Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="space-y-6">
            <div className="flex flex-col gap-2">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  ref={emailRef}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleCreate}
            appearance="primary"
          >
            Ajouter
          </Button>
          <Button
            onClick={handleClose}
            appearance="subtle"
          >
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmailList;