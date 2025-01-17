// import { useGetDocs } from "../hooks/useGetDocs";
// import { useConfirmDoc, useRefuseDoc } from "../hooks/useAdmin";
// import { Badge, IconButton, Panel, Rate, Stack, Table } from "rsuite";
// import Column from "rsuite/esm/Table/TableColumn";
// import { Cell, HeaderCell } from "rsuite-table";
// import { FaCheck, FaCross, FaTimes, FaTrash } from "react-icons/fa";
// import moment from "moment";
// import { DoctorInfoModal } from "../components/DoctorInfoModal/DoctorInfoModal";
// import { useState } from "react";
// import { NO_DOCTOR_IMAGE } from "../../../../utils/utils";
// import { FaRotateLeft } from "react-icons/fa6";

// export const Doctors = () => {
//   const [open, setOpen] = useState(false);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const { data: docs, refetch, isFetching } = useGetDocs();

//   const { mutateAsync: confirm, isPending: isConfirming } = useConfirmDoc();
//   const { mutateAsync: refuse, isPending: isRefusing } = useRefuseDoc();

//   const handleDelete = (id) => {
//     refuse({ id }).then(() => refetch());
//   };

//   const handleConfirm = (id) => {
//     confirm({ id }).then(() => refetch());
//   };

//   return (
//     <Panel
//       bordered
//       header={
//         <Stack justifyContent="space-between">
//           <div>
//             <h1 className="font-bold text-2xl leading-6">Liste des Docteurs</h1>
//             <p className="text-xs text-gray-500 font-normal">
//               Lorem ipsum dolor sit amet consectetur.
//             </p>
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
//         data={docs}
//         loading={isFetching}
//         autoHeight
//         wordWrap="break-word"
//         rowHeight={60}
//         onRowClick={(item) => {
//           setSelectedDoctor(item);
//           setOpen(true);
//         }}
//       >
//         <Column
//           verticalAlign="center"
//           flexGrow={1}
//         >
//           <HeaderCell>Nom</HeaderCell>

//           <Cell
//             style={{ padding: "6px" }}
//             className=""
//           >
//             {(item) => (
//               <div
//                 className="flex items-center text-gray-900
//                 whitespace-nowrap"
//               >
//                 <img
//                   src={item.userId.img ?? NO_DOCTOR_IMAGE}
//                   className="w-10 h-10 rounded-full"
//                   alt=""
//                 />
//                 <div className="pl-3">
//                   <div className="text-base font-semibold text-normal text-gray-500">
//                     {item.name}
//                   </div>
//                   <Rate
//                     value={item.totalRating}
//                     disabled
//                     size="xs"
//                   />
//                 </div>
//               </div>
//             )}
//           </Cell>
//         </Column>
//         <Column verticalAlign="center">
//           <HeaderCell>Clients</HeaderCell>

//           <Cell
//             style={{ padding: "6px" }}
//             className=""
//           >
//             {(item) => (
//               <div className="flex flex-col">
//                 <span>{item.totalPatients} Client(s)</span>
//                 <span>{item.totalAppointments} Rendez-vous</span>
//               </div>
//             )}
//           </Cell>
//         </Column>
//         <Column verticalAlign="center">
//           <HeaderCell>Status</HeaderCell>

//           <Cell
//             style={{ padding: "6px" }}
//             className=""
//           >
//             {(item) => (
//               <Badge
//                 className="px-2 py-1"
//                 color={item.isVerified ? "green" : "red"}
//                 content={item.isVerified ? "Validé" : "Non validé"}
//               />
//             )}
//           </Cell>
//         </Column>
//         <Column
//           verticalAlign="center"
//           width={150}
//         >
//           <HeaderCell>Créer le</HeaderCell>

//           <Cell
//             style={{ padding: "6px" }}
//             className=""
//           >
//             {(item) => moment(item.userId.createdAt).format("lll")}
//           </Cell>
//         </Column>
//         <Column
//           verticalAlign="center"
//           align="end"
//         >
//           <HeaderCell>Actions</HeaderCell>

//           <Cell style={{ padding: "6px" }}>
//             {(item) => (
//               <div
//                 hidden={item.isVerified}
//                 className="w-100 flex flex-wrap gap-2 justify-end items-center"
//               >
//                 <IconButton
//                   circle
//                   size="sm"
//                   disabled={isConfirming || isRefusing || isFetching}
//                   onClick={() => handleDelete(item.userId._id)}
//                   icon={<FaTimes />}
//                 ></IconButton>
//                 {/* Confirm button */}
//                 <IconButton
//                   circle
//                   size="sm"
//                   appearance="primary"
//                   // className="bg-primaryColor text-white"
//                   disabled={isConfirming || isRefusing || isFetching}
//                   onClick={() => handleConfirm(item.userId._id)}
//                   icon={<FaCheck />}
//                 ></IconButton>
//               </div>
//             )}
//           </Cell>
//         </Column>
//       </Table>
//       <DoctorInfoModal
//         handleClose={() => setOpen(false)}
//         open={open}
//         handleOpen={() => setOpen(true)}
//         setOpen={setOpen}
//         doctor={selectedDoctor}
//       />
//     </Panel>
//   );
// };
