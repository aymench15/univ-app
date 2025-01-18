import { Button, IconButton, Modal, Panel, Stack, Table } from "rsuite";
import { useGetAdmins } from "../hooks/useGetAdmins";
import Column from "rsuite/esm/Table/TableColumn";
import { Cell, HeaderCell } from "rsuite-table";
import { useRef, useState } from "react";
import { useRegisterAdmin } from "../../auth/useAuthAdmin";
import moment from "moment";
import { FaRotateLeft } from "react-icons/fa6";

export const Admins = () => {
  const { data: admins, refetch, isFetching } = useGetAdmins();
  const [openCreateModal, setOpenCreatModal] = useState(false);
  const handleOpen = () => setOpenCreatModal(true);
  const password = useRef();
  const name = useRef();
  const handleClose = () => {
    password.current.value = "";
    name.current.value = "";
    setOpenCreatModal(false);
  };

  const { mutate: register, isPending } = useRegisterAdmin(false);

  const handleCreate = () => {
    register({ password: password.current.value, name: name.current.value });
    handleClose();
    refetch();
  };

  return (
    <>
      <Panel
        bordered
        header={
          <Stack justifyContent="space-between">
            <div>
              <h1 className="font-bold text-2xl leading-6">
                List of Administrators
              </h1>
              <p className="text-xs text-gray-500 font-normal">
                Manage the list of system administrators.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <IconButton
                icon={<FaRotateLeft />}
                disabled={isFetching}
                onClick={refetch}
              />
              <Button
                onClick={handleOpen}
                appearance="primary"
              >
                Add
              </Button>
            </div>
          </Stack>
        }
      >
        <Table
          data={admins}
          showHeader
          loading={isFetching}
        >
          <Column flexGrow={1}>
            <HeaderCell>Name</HeaderCell>
            <Cell
              style={{ padding: "6px" }}
              className=""
            >
              {(item) => (
                <div className="flex flex-col">
                  <span>{item.name}</span>
                  <span className="text-xs text-gray-500">{item._id}</span>
                </div>
              )}
            </Cell>
          </Column>
          <Column width={150}>
            <HeaderCell>Created on</HeaderCell>

            <Cell
              style={{ padding: "6px" }}
              className=""
            >
              {(item) => moment(item.createdAt).format("lll")}
            </Cell>
          </Column>
          {/* <Column width={80}>
          <HeaderCell>...</HeaderCell>

          <Cell style={{ padding: "6px" }}>
            {(rowData) => (
              <Button
                appearance="link"
                onClick={() => alert(`id:${rowData.id}`)}
              >
                Edit
              </Button>
            )}
          </Cell>
        </Column> */}
        </Table>
      </Panel>

      <Modal
        open={openCreateModal}
        onClose={handleClose}
        className="TESTTTT"
        backdrop
        overflow
        containerClassName="flex items-ceneter justify-center"
      >
        <Modal.Header>
          <Modal.Title>Add an Administrator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="space-y-6">
            <div className="flex flex-col gap-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="name"
                  ref={name}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400   sm:text-sm sm:leading-6"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  ref={password}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400   sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={isPending}
            type="button"
            onClick={handleCreate}
            appearance="primary"
          >
            Create an account
          </Button>
          <Button
            disabled={isPending}
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
