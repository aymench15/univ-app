import moment from "moment";
import React, { useState } from "react";
import { IconButton, Pagination, Panel, Stack, Table } from "rsuite";
import { Cell, HeaderCell } from "rsuite-table";
import Column from "rsuite/esm/Table/TableColumn";
import { useGetPatients } from "../hooks/useGetPatients";
import { NO_USER_IMAGE } from "../../../../utils/utils";
import { FaRotateLeft } from "react-icons/fa6";

export const AdminPatients = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const {
    data: { data: patients, currentPage, totalPages, totalItems },
    refetch,
    isFetching,
  } = useGetPatients(page, limit);

  return (
    <Panel
      bordered
      header={
        <Stack justifyContent="space-between">
          <div>
            <h1 className="font-bold text-2xl leading-6">Liste des Patients</h1>
            <p className="text-xs text-gray-500 font-normal">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>
          <div>
            <IconButton
              icon={<FaRotateLeft />}
              disabled={isFetching}
              onClick={refetch}
            />
          </div>
        </Stack>
      }
    >
      <Table
        data={patients}
        loading={isFetching}
        autoHeight
      >
        <Column flexGrow={1}>
          <HeaderCell>Nom</HeaderCell>

          <Cell
            style={{ padding: "6px" }}
            className=""
          >
            {(item) => (
              <div
                className="flex items-center text-gray-900
                    whitespace-nowrap"
              >
                <img
                  src={item.img ?? NO_USER_IMAGE}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <div className="text-base font-semibold text-normal text-gray-500">
                    {item.name}
                  </div>
                  <div className="text-gray-500 text-xs">{item._id}</div>
                </div>
              </div>
            )}
          </Cell>
        </Column>

        <Column width={150}>
          <HeaderCell>Créer le</HeaderCell>

          <Cell
            style={{ padding: "6px" }}
            className=""
          >
            {(item) => moment(item.createdAt).format("lll")}
          </Cell>
        </Column>
        <Column>
          <HeaderCell>Actions</HeaderCell>

          <Cell style={{ padding: "6px" }}>
            {(item) => (
              <div
                hidden={item.isVerified}
                className="w-100 flex flex-wrap gap-2 justify-end items-center"
              ></div>
            )}
          </Cell>
        </Column>
      </Table>
      <div style={{ padding: 20 }}>
        <Pagination
          prev
          next
          first
          last
          ellipsis
          boundaryLinks
          maxButtons={5}
          limit={limit}
          onChangeLimit={(limit) => {
            setLimit(limit);
            setPage(1);
          }}
          limitOptions={[25, 50, 100]}
          size="xs"
          layout={["total", "-", "limit", "|", "pager", "skip"]}
          total={totalItems}
          activePage={page}
          onChangePage={setPage}
        />
      </div>
    </Panel>
  );
};
