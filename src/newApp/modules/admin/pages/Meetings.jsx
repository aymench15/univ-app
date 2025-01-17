// import moment from "moment";
// import { useState } from "react";
// import { Badge, IconButton, Pagination, Panel, Stack, Table } from "rsuite";
// import { Cell, HeaderCell } from "rsuite-table";
// import Column from "rsuite/esm/Table/TableColumn";
// import { NO_USER_IMAGE } from "../../../../utils/utils";
// import { MeetingInfoModal } from "../components/MeetingInfoModal/MeetingInfoModal";
// import { useGetMeetings } from "../hooks/useGetMeetings";
// import { FaRotateLeft } from "react-icons/fa6";

// export const AdminMeetings = () => {
//   const [page, setPage] = useState(1);
//   const [open, setOpen] = useState(false);
//   const [meetingId, setMeetingId] = useState(null);
//   const [limit, setLimit] = useState(25);
//   const {
//     data: { data, currentPage, totalPages, totalItems },
//     refetch,
//     isFetching,
//   } = useGetMeetings(page, limit);

//   return (
//     <Panel
//       bordered
//       header={
//         <Stack justifyContent="space-between">
//           <div>
//             <h1 className="font-bold text-2xl leading-6">Liste des Meetings</h1>
//             <p className="text-xs text-gray-500 font-normal"></p>
//           </div>
//           <div>
//             <IconButton
//               icon={<FaRotateLeft />}
//               disabled={isFetching}
//               onClick={refetch}
//             />
//           </div>
//         </Stack>
//       }
//     >
//       <Table
//         data={data}
//         loading={isFetching}
//         autoHeight
//         onRowClick={(row) => {
//           setMeetingId(row.meetingId);
//           setOpen(true);
//         }}
//         rowHeight={100}
//       >
//         <Column
//           verticalAlign="center"
//           fullText
//           flexGrow={1}
//         >
//           <HeaderCell>ID</HeaderCell>

//           <Cell
//             style={{ padding: "6px" }}
//             className=""
//           >
//             {(item) => (
//               <div className="flex flex-col gap-1">
//                 <div>
//                   <div className="text-xs font-semibold text-normal text-gray-500">
//                     ID du meet
//                   </div>
//                   <div>{item.meetingId}</div>
//                 </div>
//                 <div>
//                   <div className="text-xs font-semibold text-normal text-gray-500">
//                     ID du rendez-vous
//                   </div>
//                   <div>{item._id}</div>
//                 </div>
//               </div>
//             )}
//           </Cell>
//         </Column>
//         <Column
//           fullText
//           verticalAlign="center"
//           flexGrow={1}
//         >
//           <HeaderCell>Medecin</HeaderCell>

//           <Cell
//             style={{ padding: "6px" }}
//             className=""
//           >
//             {(item) => (
//               <div
//                 className="flex items-center text-gray-900
//                         whitespace-nowrap"
//               >
//                 <img
//                   src={item.doctorId.img ?? NO_USER_IMAGE}
//                   className="w-10 h-10 rounded-full"
//                   alt=""
//                 />
//                 <div className="pl-3">
//                   <div className="text-base font-semibold text-normal text-gray-500">
//                     {item.doctorId.name}
//                   </div>
//                   <div className="text-gray-500 text-xs">
//                     {item.doctorId._id}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </Cell>
//         </Column>
//         <Column
//           fullText
//           verticalAlign="center"
//           flexGrow={1}
//         >
//           <HeaderCell>Patient</HeaderCell>

//           <Cell
//             style={{ padding: "6px" }}
//             className=""
//           >
//             {(item) => (
//               <div
//                 className="flex items-center text-gray-900
//                         whitespace-nowrap"
//               >
//                 <img
//                   src={item.userId.img ?? NO_USER_IMAGE}
//                   className="w-10 h-10 rounded-full"
//                   alt=""
//                 />
//                 <div className="pl-3">
//                   <div className="text-base font-semibold text-normal text-gray-500">
//                     {item.userId.name}
//                   </div>
//                   <div className="text-gray-500 text-xs">{item.userId._id}</div>
//                 </div>
//               </div>
//             )}
//           </Cell>
//         </Column>

//         <Column
//           verticalAlign="center"
//           align="center"
//           flexGrow={1}
//         >
//           <HeaderCell>Status</HeaderCell>

//           <Cell
//             style={{ padding: "6px" }}
//             className=""
//           >
//             {(item) => (
//               <div>
//                 <Badge content={item.status} />
//               </div>
//             )}
//           </Cell>
//         </Column>
//         <Column
//           verticalAlign="center"
//           align="end"
//           flexGrow={1}
//         >
//           <HeaderCell>Date</HeaderCell>

//           <Cell
//             style={{ padding: "6px" }}
//             className=""
//           >
//             {(item) => (
//               <div>
//                 <div className="text-base font-semibold text-normal text-gray-500">
//                   {moment(item.startTime).format("ll")}
//                 </div>
//                 <div className="text-gray-500 text-xs">
//                   {moment(item.startTime).format("HH:mm")} -{" "}
//                   {moment(item.endTime).format("HH:mm")}
//                 </div>
//               </div>
//             )}
//           </Cell>
//         </Column>
//       </Table>
//       <div style={{ padding: 20 }}>
//         <Pagination
//           prev
//           next
//           first
//           last
//           ellipsis
//           boundaryLinks
//           maxButtons={5}
//           limit={limit}
//           onChangeLimit={(limit) => {
//             setLimit(limit);
//             setPage(1);
//           }}
//           limitOptions={[25, 50, 100]}
//           size="xs"
//           layout={["total", "-", "limit", "|", "pager", "skip"]}
//           total={totalItems}
//           activePage={page}
//           onChangePage={setPage}
//         />
//       </div>
//       <MeetingInfoModal
//         handleClose={() => setOpen(false)}
//         open={open}
//         handleOpen={() => setOpen(true)}
//         setOpen={setOpen}
//         meetingId={meetingId}
//       />{" "}
//     </Panel>
//   );
// };
