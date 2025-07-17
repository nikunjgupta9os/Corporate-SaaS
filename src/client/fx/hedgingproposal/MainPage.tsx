import type { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useMemo, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
// import Layout from "../../common/Layout";
import "../../styles/theme.css";
import NyneOSTable from "./HedgingReuseableTable";
const cURLHOST = "https://backend-5n7t.onrender.com/api";

// Fallback data for userVars, renderVars, and userJourney
// const fallbackUserVars: IfPayload["userVars"] = {
//   roleName: "Guest",
//   firstName: "John",
//   secondName: "Doe",
//   dateLoggedIn: "2025-07-14",
//   timeLoggedIn: "10:00",
//   userEmailId: "guest@example.com",
//   isLoggedIn: true,
//   notification: {
//     messages: [],
//   },
// };

// const fallbackRenderVars: IfPayload["renderVars"] = {
//   success: true,
//   proposals: [
//     {
//       id: "HP001",
//       business_unit: "Finance",
//       type: "PO",
//       po_currency: "USD",
//       hedge_month1: 1000,
//       hedge_month2: 1200,
//       hedge_month3: 1100,
//       hedge_month4: 1300,
//       hedge_month4to6: 1500,
//       hedge_month6plus: 2000,
//       old_hedge_month1: 950,
//       old_hedge_month2: 1150,
//       old_hedge_month3: 1050,
//       old_hedge_month4: 1250,
//       old_hedge_month4to6: 1450,
//       old_hedge_month6plus: 1900,
//       remarks: "Market adjustment",
//       status_hedge: "Pending",
//     },
//   ],
// };

// const fallbackUserJourney: IfPayload["userJourney"] = {
//   process: "Init",
//   nextPageToCall: "/dashboard",
//   actionCalledFrom: "login",
// };

//  fechRenderVars, fetchUserVars, and fetchUserJourney functions
async function fetchRenderVars(): Promise<IfPayload["renderVars"]> {
  const res = await fetch(`${cURLHOST}/hedgingProposal/aggregate`);
  if (!res.ok) throw new Error("Failed to fetch renderVars");
  return res.json();
}

// async function fetchUserVars(): Promise<IfPayload["userVars"]> {
//   const res = await fetch(`${cURLHOST}/hedgingProposal/aggregate`);
//   if (!res.ok) throw new Error("Failed to fetch userVars");
//   return res.json();
// }

// async function fetchUserJourney(): Promise<IfPayload["userJourney"]> {
//   const res = await fetch(`${cURLHOST}/exposureUpload/userJourney`);
//   if (!res.ok) throw new Error("Failed to fetch userJourney");
//   return res.json();
// }

interface Message {
  date: string;
  priority: number;
  deadline: string;
  text: string;
}

interface IfPayload {
  userVars: {
    roleName: string;
    firstName: string;
    secondName: string;
    dateLoggedIn: string;
    timeLoggedIn: string;
    isLoggedIn: boolean;
    userEmailId: string;
    notification: {
      messages: Message[];
    };
  };
  renderVars: {
    // isLoadable: boolean;
    // allExposuresTab: boolean;
    // pendingApprovalTab: boolean;
    // uploadingTab: boolean;
    // btnApprove: boolean;
    // buAccessible: string[];
    // pageData: HedgingProposal[];
    success: boolean;
    proposals: HedgingProposal[];
  };
  userJourney: {
    process: string;
    nextPageToCall: string;
    actionCalledFrom: string;
  };
}

// Define Interface according to the table Columns and Structure

interface HedgingProposal {
  id: string;
  business_unit: string;
  po_currency: string;
  type?: string; // Added type field

  // New Hedging Months
  hedge_month1: number;
  hedge_month2: number;
  hedge_month3: number;
  hedge_month4: number;
  hedge_month4to6: number;
  hedge_month6plus: number;

  // Old Hedging Months
  old_hedge_month1: number;
  old_hedge_month2: number;
  old_hedge_month3: number;
  old_hedge_month4: number;
  old_hedge_month4to6: number;
  old_hedge_month6plus: number;

  // Optional
  remarks?: string;
  status_hedge?: string;
}


const AllUsers: React.FC = () => {
  const [renderVars, setRenderVars] = useState<IfPayload["renderVars"] | null>(
    null
  );
  // const [userVars, setUserVars] = useState<IfPayload["userVars"] | null>(null);
  // const [userJourney, setUserJourney] = useState<
  //   IfPayload["userJourney"] | null
  // >(null);
  // const [isLoading, setIsLoading] = useState(true);

  // Change UseState Interface
  const [data, setData] = useState<HedgingProposal[]>([]);
  // const [editingRemarkRowId, setEditingRemarkRowId] = useState<string | null>(
  //   null
  // );

  // const [editingMonthCell, setEditingMonthCell] = useState<{
  //   rowId: string;
  //   field: string;
  //   tempValue: number;
  // } | null>(null);
  // setEditingMonthCell(null)
  const [editingRemark, setEditingRemark] = useState<{
    rowId: string;
    tempValue: string;
  } | null>(null);

  useEffect(() => {
    // setIsLoading(true);
    fetchRenderVars()
      .then((res) => {
        const cleaned = res.proposals.map((p) => ({
          ...p,
          hedge_month1: p.hedge_month1 ?? 0,
          hedge_month2: p.hedge_month2 ?? 0,
          hedge_month3: p.hedge_month3 ?? 0,
          hedge_month4: p.hedge_month4 ?? 0,
          hedge_month4to6: p.hedge_month4to6 ?? 0,
          hedge_month6plus: p.hedge_month6plus ?? 0,
          old_hedge_month1: p.old_hedge_month1 ?? 0,
          old_hedge_month2: p.old_hedge_month2 ?? 0,
          old_hedge_month3: p.old_hedge_month3 ?? 0,
          old_hedge_month4: p.old_hedge_month4 ?? 0,
          old_hedge_month4to6: p.old_hedge_month4to6 ?? 0,
          old_hedge_month6plus: p.old_hedge_month6plus ?? 0,
          remarks: p.remarks ?? "",
          status_hedge: p.status_hedge ?? "Draft",
        }));
        setRenderVars(res);
        setData(cleaned);
      })
      .catch(() => renderVars );

    // fetchUserVars()
    //   .then(setUserVars)
    //   .catch(() => setUserVars(fallbackUserVars));

    // fetchUserJourney()
    //   .then(setUserJourney)
    //   .catch(() => setUserJourney(fallbackUserJourney));
  }, []);

  const columns = useMemo<ColumnDef<HedgingProposal>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="w-4 accent-primary h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="accent-primary w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
          />
        ),
        size: 50,
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => (
          <span className="font-medium text-secondary-text-dark">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "business_unit",
        header: "Business Unit",
        cell: ({ getValue }) => (
          <span className="text-secondary-text">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "po_currency",
        header: "Currency",
        cell: ({ getValue }) => (
          <span className="text-secondary-text">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "hedge_month1",
        header: "Hedge Month 1",
        cell: ({ row }) => {
          const rowId = row.original.id;
          const value = row.original.hedge_month1;
          const oldValue = row.original.old_hedge_month1;

          return (
            <div>
              <input
                type="number"
                defaultValue={value}
                className="w-24 px-2 py-1 rounded text-sm text-secondary-text bg-secondary-color border border-border"
                onBlur={(e) => {
                  const newValue = Number(e.target.value);
                  if (newValue !== value) {
                    handleUpdate(rowId, {
                      hedge_month1: newValue,
                      old_hedge_month1: value,
                    });
                  }
                }}
              />
              <span className="block text-xs text-secondary-text-dark mt-1">
                Old: {oldValue}
              </span>
            </div>
          );
        },
      },

      {
        accessorKey: "hedge_month2",
        header: "Hedge Month 2",
        cell: ({ row }) => {
          const rowId = row.original.id;
          const value = row.original.hedge_month2;
          const oldValue = row.original.old_hedge_month2;

          return (
            <div>
              <input
                type="number"
                defaultValue={value}
                className="w-24 px-2 py-1 rounded text-sm text-secondary-text bg-secondary-color border border-border"
                onBlur={(e) => {
                  const newValue = Number(e.target.value);
                  if (newValue !== value) {
                    handleUpdate(rowId, {
                      hedge_month2: newValue,
                      old_hedge_month2: value,
                    });
                  }
                }}
              />
              <span className="block text-xs text-secondary-text-dark mt-1">
                Old: {oldValue}
              </span>
            </div>
          );
        },
      },

      {
        accessorKey: "hedge_month3",
        header: "Hedge Month 3",
        cell: ({ row }) => {
          const rowId = row.original.id;
          const value = row.original.hedge_month3;
          const oldValue = row.original.old_hedge_month3;

          return (
            <div>
              <input
                type="number"
                defaultValue={value}
                className="w-24 px-2 py-1 rounded text-sm text-secondary-text bg-secondary-color border border-border"
                onBlur={(e) => {
                  const newVal = Number(e.target.value);
                  if (newVal !== value) {
                    handleUpdate(rowId, {
                      hedge_month3: newVal,
                      old_hedge_month3: value,
                    });
                  }
                }}
              />
              <span className="block text-xs text-secondary-text-dark mt-1">
                Old: {oldValue}
              </span>
            </div>
          );
        },
      },

      {
        accessorKey: "hedge_month4",
        header: "Hedge Month 4",
        cell: ({ row }) => {
          const rowId = row.original.id;
          const value = row.original.hedge_month4;
          const oldValue = row.original.old_hedge_month4;

          return (
            <div>
              <input
                type="number"
                defaultValue={value}
                className="w-24 px-2 py-1 rounded text-sm text-secondary-text bg-secondary-color border border-border"
                onBlur={(e) => {
                  const newVal = Number(e.target.value);
                  if (newVal !== value) {
                    handleUpdate(rowId, {
                      hedge_month4: newVal,
                      old_hedge_month4: value,
                    });
                  }
                }}
              />
              <span className="block text-xs text-secondary-text-dark mt-1">
                Old: {oldValue}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "hedge_month4to6",
        header: "Month 4–6",
        cell: ({ row }) => {
          const rowId = row.original.id;
          const value = row.original.hedge_month4to6;
          const oldValue = row.original.old_hedge_month4to6;

          return (
            <div>
              <input
                type="number"
                defaultValue={value}
                className="w-24 px-2 py-1 rounded text-sm text-secondary-text bg-secondary-color border border-border"
                onBlur={(e) => {
                  const newVal = Number(e.target.value);
                  if (newVal !== value) {
                    handleUpdate(rowId, {
                      hedge_month4to6: newVal,
                      old_hedge_month4to6: value,
                    });
                  }
                }}
              />
              <span className="block text-xs text-secondary-text-dark mt-1">
                Old: {oldValue}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "hedge_month6plus",
        header: "Month > 6",
        cell: ({ row }) => {
          const rowId = row.original.id;
          const value = row.original.hedge_month6plus;
          const oldValue = row.original.old_hedge_month6plus;

          return (
            <div>
              <input
                type="number"
                defaultValue={value}
                className="w-24 px-2 py-1 rounded text-sm text-secondary-text bg-secondary-color border border-border"
                onBlur={(e) => {
                  const newVal = Number(e.target.value);
                  if (newVal !== value) {
                    handleUpdate(rowId, {
                      hedge_month6plus: newVal,
                      old_hedge_month6plus: value,
                    });
                  }
                }}
              />
              <span className="block text-xs text-secondary-text-dark mt-1">
                Old: {oldValue}
              </span>
            </div>
          );
        },
      },

      // {
      //   accessorKey: "old_hedge_month1",
      //   header: "Old Month 1",
      //   cell: ({ row, getValue }) => {
      //     const value = getValue() as number;
      //     const updateValue = (newVal: number) => {
      //       const updatedRow = {
      //         ...row.original,
      //         old_hedge_month1: newVal,
      //       };
      //       row.table.options.meta?.updateData(row.index, updatedRow);
      //     };
      //     return (
      //       <input
      //         type="number"
      //         value={value}
      //         className="w-24 px-2 py-1 border rounded text-sm"
      //         onChange={(e) => updateValue(Number(e.target.value))}
      //       />
      //     );
      //   },
      // },
      // {
      //   accessorKey: "old_hedge_month2",
      //   header: "Old Month 2",
      //   cell: ({ row, getValue }) => {
      //     const value = getValue() as number;
      //     const updateValue = (newVal: number) => {
      //       const updatedRow = {
      //         ...row.original,
      //         old_hedge_month2: newVal,
      //       };
      //       row.table.options.meta?.updateData(row.index, updatedRow);
      //     };
      //     return (
      //       <input
      //         type="number"
      //         value={value}
      //         className="w-24 px-2 py-1 border rounded text-sm"
      //         onChange={(e) => updateValue(Number(e.target.value))}
      //       />
      //     );
      //   },
      // },
      // {
      //   accessorKey: "old_hedge_month3",
      //   header: "Old Month 3",
      //   cell: ({ row, getValue }) => {
      //     const value = getValue() as number;
      //     const updateValue = (newVal: number) => {
      //       const updatedRow = {
      //         ...row.original,
      //         old_hedge_month3: newVal,
      //       };
      //       row.table.options.meta?.updateData(row.index, updatedRow);
      //     };
      //     return (
      //       <input
      //         type="number"
      //         value={value}
      //         className="w-24 px-2 py-1 border rounded text-sm"
      //         onChange={(e) => updateValue(Number(e.target.value))}
      //       />
      //     );
      //   },
      // },
      // {
      //   accessorKey: "old_hedge_month4",
      //   header: "Old Month 4",
      //   cell: ({ row, getValue }) => {
      //     const value = getValue() as number;
      //     const updateValue = (newVal: number) => {
      //       const updatedRow = {
      //         ...row.original,
      //         old_hedge_month4: newVal,
      //       };
      //       row.table.options.meta?.updateData(row.index, updatedRow);
      //     };
      //     return (
      //       <input
      //         type="number"
      //         value={value}
      //         className="w-24 px-2 py-1 border rounded text-sm"
      //         onChange={(e) => updateValue(Number(e.target.value))}
      //       />
      //     );
      //   },
      // },
      // {
      //   accessorKey: "old_hedge_month4to6",
      //   header: "Old 4–6",
      //   cell: ({ row, getValue }) => {
      //     const value = getValue() as number;
      //     const updateValue = (newVal: number) => {
      //       const updatedRow = {
      //         ...row.original,
      //         old_hedge_month4to6: newVal,
      //       };
      //       row.table.options.meta?.updateData(row.index, updatedRow);
      //     };
      //     return (
      //       <input
      //         type="number"
      //         value={value}
      //         className="w-24 px-2 py-1 border rounded text-sm"
      //         onChange={(e) => updateValue(Number(e.target.value))}
      //       />
      //     );
      //   },
      // },
      // {
      //   accessorKey: "old_hedge_month6plus",
      //   header: "Old > 6",
      //   cell: ({ row, getValue }) => {
      //     const value = getValue() as number;
      //     const updateValue = (newVal: number) => {
      //       const updatedRow = {
      //         ...row.original,
      //         old_hedge_month6plus: newVal,
      //       };
      //       row.table.options.meta?.updateData(row.index, updatedRow);
      //     };
      //     return (
      //       <input
      //         type="number"
      //         value={value}
      //         className="w-24 px-2 py-1 border rounded text-sm"
      //         onChange={(e) => updateValue(Number(e.target.value))}
      //       />
      //     );
      //   },
      // },
      {
        accessorKey: "remarks",
        header: "Remarks",
        cell: ({ row, getValue }) => {
          const rowId = row.original.id;
          const value = getValue() as string;
          const isEditing = editingRemark && editingRemark.rowId === rowId;
          if (isEditing) {
            return (
              <span>
                <input
                  type="text"
                  value={editingRemark.tempValue}
                  autoFocus
                  className="w-full px-2 py-1 border rounded text-sm"
                  onChange={(e) => {
                    setEditingRemark({ rowId, tempValue: e.target.value });
                  }}
                  onBlur={() => {
                    handleUpdate(rowId, { remarks: editingRemark.tempValue });
                    setEditingRemark(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUpdate(rowId, { remarks: editingRemark.tempValue });
                      setEditingRemark(null);
                    }
                  }}
                />
              </span>
            );
          }
          return (
            <span
              className="text-secondary-text italic cursor-pointer"
              onClick={() => setEditingRemark({ rowId, tempValue: value })}
              title="Click to edit"
            >
              {value}
            </span>
          );
        },
      },
      {
        accessorKey: "status_hedge",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          const statusColors: Record<string, string> = {
            Approved: "bg-green-100 text-green-800 border-green-400",
            Pending: "bg-yellow-100 text-yellow-800 border-yellow-400",
            Rejected: "bg-red-100 text-red-800 border-red-400",
            Draft: "bg-gray-200 text-gray-700 border-gray-400",
          };
          return (
            <span
              className={`px-3 py-1 text-xs border font-medium rounded-full ${
                statusColors[status] || "bg-gray-200 text-gray-600"
              }`}
            >
              {status || "—"}
            </span>
          );
        },
      },
    ],
    [editingRemark]
  );

  // Default column visibility
  const defaultVisibility: Record<string, boolean> = {
    select: true,
    business_unit: true,
    po_currency: true,
    type: true, // Ensure type column is visible

    // Hedge Months (New)
    hedge_month1: true,
    hedge_month2: true,
    hedge_month3: true,
    hedge_month4: false,
    hedge_month4to6: true,
    hedge_month6plus: true,

    // Old Hedge Months
    old_hedge_month1: false,
    old_hedge_month2: false,
    old_hedge_month3: false,
    old_hedge_month4: false,
    old_hedge_month4to6: false,
    old_hedge_month6plus: false,

    // Optional
    remarks: false,
    status_hedge: true,

    // Action column
    // actions: true,
  };

  //Handle Updation in Editing Function
  const handleUpdate = async (
    rowId: string,
    changes: Partial<HedgingProposal>
  ) => {
    try {
       console.log("Updating row:", rowId, "with changes:", changes);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state
      setData((prevData) =>
        prevData.map((item) =>
          item.id === rowId ? { ...item, ...changes } : item
        )
      );

      return true;
    } catch (error) {
       console.error("Error updating:", error);
      return false;
    }
  };

  // if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="space-y-6">

        {/* Define the Table Data */}
        <NyneOSTable 
          data={data}
          columns={columns}
          defaultColumnVisibility={defaultVisibility}
          draggableColumns={[
            "business_unit",
            "po_currency",
            "hedge_month1",
            "hedge_month2",
            "hedge_month3",
            "hedge_month4",
            "hedge_month4to6",
            "hedge_month6plus",
            //   "remarks",
            "status_hedge",
          ]}
          sortableColumns={[
            "business_unit",
            "po_currency",
            "hedge_month1",
            "hedge_month2",
            "hedge_month3",
            "hedge_month4",
            "hedge_month4to6",
            "hedge_month6plus",
            "status_hedge",
          ]}
          // Optionally include this if you have extra expandable fields
          // expandedRowConfig={expandedRowConfig}
          onUpdate={handleUpdate}
          className="mb-8"
        />
      </div>
    </>
  );
};

export default AllUsers;
