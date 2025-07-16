import type { ColumnDef } from "@tanstack/react-table";
import { Download, Trash2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Layout from "../../common/Layout";
import "../../styles/theme.css";
import NyneOSTable from "./ReUseableTable";
// const cURLHOST = "https://backend-5n7t.onrender.com/api";

// Fallback data for userVars, renderVars, and userJourney
const fallbackUserVars: IfPayload["userVars"] = {
  roleName: "Guest",
  firstName: "John",
  secondName: "Doe",
  dateLoggedIn: "2025-07-14",
  timeLoggedIn: "10:00",
  userEmailId: "guest@example.com",
  isLoggedIn: true,
  notification: {
    messages: [],
  },
};

const fallbackRenderVars: IfPayload["renderVars"] = {
  isLoadable: true,
  allExposuresTab: false,
  pendingApprovalTab: true,
  uploadingTab: false,
  btnApprove: false,
  buAccessible: ["Finance", "Sales"],
  PageData: [
    {
      id: "HP001",
      businessUnit: "Finance",
      type:"PO",
      po_currency: "USD",
      hedgeMonth1: 1000,
      hedgeMonth2: 1200,
      hedgeMonth3: 1100,
      hedgeMonth4: 1300,
      hedgeMonth4to6: 1500,
      hedgeMonth6plus: 2000,
      oldHedgeMonth1: 950,
      oldHedgeMonth2: 1150,
      oldHedgeMonth3: 1050,
      oldHedgeMonth4: 1250,
      oldHedgeMonth4to6: 1450,
      oldHedgeMonth6plus: 1900,
      remarks: "Market adjustment",
      statusHedge: "Pending",
    },
  ],
};

const fallbackUserJourney: IfPayload["userJourney"] = {
  process: "Init",
  nextPageToCall: "/dashboard",
  actionCalledFrom: "login",
};

//  fechRenderVars, fetchUserVars, and fetchUserJourney functions
function fetchRenderVars(): Promise<IfPayload["renderVars"]> {
  return new Promise((resolve) => {
    resolve(fallbackRenderVars);
  });
}

function fetchUserVars(): Promise<IfPayload["userVars"]> {
  return new Promise((resolve) => {
    resolve(fallbackUserVars);
  });
}

function fetchUserJourney(): Promise<IfPayload["userJourney"]> {
  return new Promise((resolve) => {
    resolve(fallbackUserJourney);
  });
}

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
    isLoadable: boolean;
    allExposuresTab: boolean;
    pendingApprovalTab: boolean;
    uploadingTab: boolean;
    btnApprove: boolean;
    buAccessible: string[];
    PageData: HedgingProposal[];
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
  businessUnit: string;
  po_currency: string;
  type?: string; // Added type field

  // New Hedging Months
  hedgeMonth1: number;
  hedgeMonth2: number;
  hedgeMonth3: number;
  hedgeMonth4: number;
  hedgeMonth4to6: number;
  hedgeMonth6plus: number;

  // Old Hedging Months
  oldHedgeMonth1: number;
  oldHedgeMonth2: number;
  oldHedgeMonth3: number;
  oldHedgeMonth4: number;
  oldHedgeMonth4to6: number;
  oldHedgeMonth6plus: number;

  // Optional
  remarks?: string;
  statusHedge?: string;
}

const mockHedgingProposals: HedgingProposal[] = [
  {
    id: "HP001",
    businessUnit: "Finance",
    po_currency: "USD",
    type: "PO", // Added type field
    hedgeMonth1: 1000,
    hedgeMonth2: 1500,
    hedgeMonth3: 1200,
    hedgeMonth4: 1300,
    hedgeMonth4to6: 1800,
    hedgeMonth6plus: 2200,
    oldHedgeMonth1: 900,
    oldHedgeMonth2: 1400,
    oldHedgeMonth3: 1100,
    oldHedgeMonth4: 1250,
    oldHedgeMonth4to6: 1700,
    oldHedgeMonth6plus: 2000,
    remarks: "Increased forecast for Q3",
    statusHedge: "Pending",
  },
  {
    id: "HP002",
    businessUnit: "Sales",
    po_currency: "EUR",
    type: "PO", // Added type field
    hedgeMonth1: 2000,
    hedgeMonth2: 1800,
    hedgeMonth3: 1600,
    hedgeMonth4: 1700,
    hedgeMonth4to6: 1900,
    hedgeMonth6plus: 2500,
    oldHedgeMonth1: 1900,
    oldHedgeMonth2: 1700,
    oldHedgeMonth3: 1500,
    oldHedgeMonth4: 1600,
    oldHedgeMonth4to6: 1850,
    oldHedgeMonth6plus: 2400,
    remarks: "Stable volumes expected",
    statusHedge: "Approved",
  },
  {
    id: "HP003",
    businessUnit: "Logistics",
    po_currency: "INR",
    type: "PO", // Added type field
    hedgeMonth1: 800,
    hedgeMonth2: 900,
    hedgeMonth3: 950,
    hedgeMonth4: 970,
    hedgeMonth4to6: 1000,
    hedgeMonth6plus: 1100,
    oldHedgeMonth1: 850,
    oldHedgeMonth2: 920,
    oldHedgeMonth3: 940,
    oldHedgeMonth4: 960,
    oldHedgeMonth4to6: 990,
    oldHedgeMonth6plus: 1050,
    remarks: "Adjusted for inflation",
    statusHedge: "Draft",
  },
];

const AllUsers: React.FC = () => {
  const [renderVars, setRenderVars] = useState<IfPayload["renderVars"] | null>(
    null
  );
  const [userVars, setUserVars] = useState<IfPayload["userVars"] | null>(null);
  const [userJourney, setUserJourney] = useState<
    IfPayload["userJourney"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  // Change UseState Interface
  const [data, setData] = useState<HedgingProposal[]>([]);

  useEffect(() => {
    setIsLoading(true);

    fetchRenderVars()
      .then((renderVarsRes) => {
        setRenderVars(renderVarsRes);
        if (Array.isArray(renderVarsRes.PageData)) {
          setData(renderVarsRes.PageData);
        } else {
          setData(mockHedgingProposals);
        }
      })
      .catch((err) => {
         console.error("Error fetching renderVars:", err);
        setRenderVars(fallbackRenderVars);
      });

    fetchUserVars()
      .then((userVarsRes) => {
        setUserVars(userVarsRes);
        if (!userVarsRes?.isLoggedIn) {
          setRenderVars((prev) =>
            prev ? { ...prev, isLoadable: false } : prev
          );
        }
      })
      .catch((err: any) => {
         console.error("Error fetching userVars:", err);
        setUserVars(fallbackUserVars);
      });

    fetchUserJourney()
      .then((userJourneyRes) => setUserJourney(userJourneyRes))
      .catch((err) => {
         console.error("Error fetching userJourney:", err);
        setUserJourney(fallbackUserJourney);
      });
  }, []);

  // Define columns for the table
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
        accessorKey: "businessUnit",
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
        accessorKey: "hedgeMonth1",
        header: "Hedge Month 1",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              hedgeMonth1: newVal,
            };
            row.getTable().options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "hedgeMonth2",
        header: "Hedge Month 2",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              hedgeMonth2: newVal,
            };
            row.getTable().options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "hedgeMonth3",
        header: "Hedge Month 3",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              hedgeMonth3: newVal,
            };
            row.getTable().options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "hedgeMonth4",
        header: "Hedge Month 4",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              hedgeMonth4: newVal,
            };
            row.getTable().options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "hedgeMonth4to6",
        header: "Month 4–6",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              hedgeMonth4to6: newVal,
            };
            row.getTable().options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "hedgeMonth6plus",
        header: "Month > 6",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              hedgeMonth6plus: newVal,
            };
            row.getTable().options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "oldHedgeMonth1",
        header: "Old Month 1",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              oldHedgeMonth1: newVal,
            };
            row.table.options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "oldHedgeMonth2",
        header: "Old Month 2",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              oldHedgeMonth2: newVal,
            };
            row.table.options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "oldHedgeMonth3",
        header: "Old Month 3",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              oldHedgeMonth3: newVal,
            };
            row.table.options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "oldHedgeMonth4",
        header: "Old Month 4",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              oldHedgeMonth4: newVal,
            };
            row.table.options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "oldHedgeMonth4to6",
        header: "Old 4–6",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              oldHedgeMonth4to6: newVal,
            };
            row.table.options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "oldHedgeMonth6plus",
        header: "Old > 6",
        cell: ({ row, getValue }) => {
          const value = getValue() as number;
          const updateValue = (newVal: number) => {
            const updatedRow = {
              ...row.original,
              oldHedgeMonth6plus: newVal,
            };
            row.table.options.meta?.updateData(row.index, updatedRow);
          };
          return (
            <input
              type="number"
              value={value}
              className="w-24 px-2 py-1 border rounded text-sm"
              onChange={(e) => updateValue(Number(e.target.value))}
            />
          );
        },
      },
      {
        accessorKey: "remarks",
        header: "Remarks",
        cell: ({ getValue }) => (
          <span className="text-secondary-text italic">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "statusHedge",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          const statusColors: Record<string, string> = {
            Approved: "bg-green-100 text-green-800",
            Pending: "bg-yellow-100 text-yellow-800",
            Rejected: "bg-red-100 text-red-800",
            Draft: "bg-gray-100 text-gray-700",
          };
          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusColors[status] || "bg-gray-200 text-gray-600"
              }`}
            >
              {status || "—"}
            </span>
          );
        },
      },
      
    ],
    []
  );

  // Default column visibility
  const defaultVisibility: Record<string, boolean> = {
    select: true,
    businessUnit: true,
    currency: true,
    type: true, // Ensure type column is visible

    // Hedge Months (New)
    hedgeMonth1: true,
    hedgeMonth2: true,
    hedgeMonth3: true,
    hedgeMonth4: true,
    hedgeMonth4to6: true,
    hedgeMonth6plus: true,

    // Old Hedge Months
    oldHedgeMonth1: false,
    oldHedgeMonth2: false,
    oldHedgeMonth3: false,
    oldHedgeMonth4: false,
    oldHedgeMonth4to6: false,
    oldHedgeMonth6plus: false,

    // Optional
    remarks: true,
    statusHedge: true,

    // Action column
    actions: true,
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
    <Layout title="Hedging Proposals">
      {/* <h2 className="text-2xl font-bold mb-4">Hedging Proposal</h2> */}

    

      <h3 className="text-xl text-secondary-text font-bold mb-4">
        Hedging Proposal Table
      </h3>

      {/* Define the Table Data */}
      <NyneOSTable
        data={data}
        columns={columns}
        defaultColumnVisibility={defaultVisibility}
        draggableColumns={[
          "businessUnit",
          "currency",
          "hedgeMonth1",
          "hedgeMonth2",
          "hedgeMonth3",
          "hedgeMonth4",
          "hedgeMonth4to6",
          "hedgeMonth6plus",
          "remarks",
          "statusHedge",
        ]}
        sortableColumns={[
          "businessUnit",
          "currency",
          "hedgeMonth1",
          "hedgeMonth2",
          "hedgeMonth3",
          "hedgeMonth4",
          "hedgeMonth4to6",
          "hedgeMonth6plus",
          "statusHedge",
        ]}
        // Optionally include this if you have extra expandable fields
        // expandedRowConfig={expandedRowConfig}
        onUpdate={handleUpdate}
        className="mb-8"
      />
    </Layout>
  );
};

export default AllUsers;