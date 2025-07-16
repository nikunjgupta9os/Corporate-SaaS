import React, { useEffect, useState, useMemo } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
// import { Download, Trash2 } from "lucide-react";
// import Layout from "../../common/Layout";
import NyneOSTable from "./ReusableTable";
import type { ColumnDef } from "@tanstack/react-table";
import "../../styles/theme.css";

const cURLHOST = "https://backend-5n7t.onrender.com/api";

const fallbackUserJourney: IfPayload["userJourney"] = {
  process: "Init",
  nextPageToCall: "/dashboard",
  actionCalledFrom: "login",
};

async function fetchRenderVars(): Promise<IfPayload["renderVars"]> {
  const res = await fetch(`${cURLHOST}/exposureBucketing/renderVars`);
  if (!res.ok) throw new Error("Failed to fetch renderVars");
  return res.json();
}

async function fetchUserVars(): Promise<IfPayload["userVars"]> {
  const res = await fetch(`${cURLHOST}/exposureBucketing/userVars`);
  if (!res.ok) throw new Error("Failed to fetch userVars");
  return res.json();
}

async function fetchUserJourney(): Promise<IfPayload["userJourney"]> {
  const res = await fetch(`${cURLHOST}/exposureBucketing/userJourney`);
  if (!res.ok) throw new Error("Failed to fetch userJourney");
  return res.json();
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
    pageData: ExposureRequest[];
  };
  userJourney: {
    process: string;
    nextPageToCall: string;
    actionCalledFrom: string;
  };
}

interface ExposureRequest {
  id?: string;
  reference_no?: string;
  type?: string;
  business_unit?: string;
  vendor_beneficiary?: string;
  po_amount?: number;
  po_currency?: string;
  maturity_expiry_date?: string;
  status_bucketing?: string;  
  comments?: string;
  po_details?: string;
  updated_at?: string;

  advance_given?: number;
  inco_term?: string;
  month_1?: number;
  month_2?: number;
  month_3?: number;
  month_4_6?: number;
  month_6plus?: number;
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
    pageData: ExposureRequest[];
  };
  userJourney: {
    process: string;
    nextPageToCall: string;
    actionCalledFrom: string;
  };
}

const ExposureBucketing: React.FC = () => {
  const [renderVars, setRenderVars] = useState<IfPayload["renderVars"] | null>(
    null
  );
  const [userVars, setUserVars] = useState<IfPayload["userVars"] | null>(null);
  const [userJourney, setUserJourney] = useState<
    IfPayload["userJourney"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ExposureRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  // const [originalData, setOriginalData] = useState<ExposureRequest[]>([]); // Store original unfiltered data

  const statusOptions = useMemo(() => {
    const options = new Set<string>();
    data.forEach((user) => {
      if (user.status_bucketing) options.add(user.status_bucketing);
    });
    return ["All", ...Array.from(options)];
  }, [data]);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    //    if (searchTerm.trim()) {
    //      const lowerSearch = searchTerm.toLowerCase();
    //      result = result.filter((user) => {
    //        return Object.entries(user)
    //          .flatMap(([key, value]) => {
    //            if (typeof value === "object" && value !== null) {
    //              return Object.values(value);
    //            }
    //            return value;
    //          })
    //          .filter(Boolean)
    //          .some((field) => String(field).toLowerCase().includes(lowerSearch));
    //      });
    //    }

    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter((user) => user.status_bucketing === statusFilter);
    }

    return result;
  }, [data, statusFilter]);

  useEffect(() => {
    setIsLoading(true);

    fetchRenderVars()
      .then((renderVarsRes) => {
        setRenderVars(renderVarsRes);
        if (Array.isArray(renderVarsRes.pageData)) {
          setData(renderVarsRes.pageData);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
         console.error("Error fetching renderVars:", err);
        // setRenderVars(fallbackRenderVars);
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
        // setUserVars();
      });

    fetchUserJourney()
      .then((userJourneyRes) => setUserJourney(userJourneyRes))
      .catch((err) => {
         console.error("Error fetching userJourney:", err);
        setUserJourney(fallbackUserJourney);
      });
  }, []);

  //   useEffect(() => {
  //   // Simulate loading
  //   setTimeout(() => {
  //     setRenderVars(fallbackRenderVars);
  //     setUserVars(fallbackUserVars);
  //     setUserJourney(fallbackUserJourney);
  //     setData(fallbackRenderVars.pageData);
  //     setIsLoading(false);
  //   }, 100); // Optional delay for realistic loading
  // }, []);

  const columns = useMemo<ColumnDef<ExposureRequest>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="accent-primary w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
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
        accessorKey: "reference_no",
        header: "PO Number",
        cell: ({ getValue }) => (
          <span className="font-medium text-secondary-text-dark">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "vendor_beneficiary",
        header: "Vendor/Beneficiary",
        cell: ({ getValue }) => (
          <span className="text-secondary-text">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "status_bucketing",
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as string;
          const statusColors: Record<string, string> = {
            Approved: "bg-green-100 text-green-800",
            Pending: "bg-yellow-100 text-yellow-800",
            Rejected: "bg-red-100 text-red-800",
            Inactive: "bg-gray-200 text-gray-700",
          };
          return (
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusColors[status] || "bg-gray-100 text-gray-800"
              }`}
            >
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  const defaultVisibility: Record<string, boolean> = {
    select: true,
    reference_no: true,
    type: true,
    business_unit: true,
    vendor_beneficiary: true,
    po_amount: true,
    po_currency: true,
    maturity_expiry_date: true,
    linked_id: true,
    status_bucketing: true,
    actions: true,
  };

  const expandedRowConfig = {
    sections: [
      {
        title: "PO Details",
        fields: [
          "type",
          "business_unit",
          "po_amount",
          "po_currency",
          "maturity_expiry_date",
          "po_details",
        ],
      },
      {
        title: "Exposure Payment Breakdown",
        fields: [
          "advance",
          "inco",
          "month_1",
          "month_2",
          "month_3",
          "month_4_6",
          "month_6plus",
          "remaining_percentage",
        ],
      },
      {
        title: "Approval Info",
        fields: ["comments"],
      },
    ],
    editableFields: [
      "advance",
      "inco",
      "month_1",
      "month_2",
      "month_3",
      "month_4_6",
      "month_6plus",
      "comments",
    ],
    fieldLabels: {
      advance: "Advance Given",
      inco: "INCO Term",
      month_1: "Month 1",
      month_2: "Month 2",
      month_3: "Month 3",
      month_4_6: "Month 4 to 6",
      month_6plus: "Month > 6",
      comments: "Checker Comments",
      // status: "Status",
      po_details: "PO Details",
      maturity_expiry_date: "Maturity/Expiry Date",
      po_currency: "PO Currency",
      po_amount: "PO Amount",
      type: "Payable / Receivable",
      business_unit: "Business Unit",
      remaining_percentage: "Remaining %",
    },
    customRenderPerField: {
      remaining_percentage: (row) => {
        const {
          po_amount = 0,
          advance = 0,
          month_1 = 0,
          month_2 = 0,
          month_3 = 0,
          month_4_6 = 0,
          month_6plus = 0,
        } = row.original;

        const totalPaid =
          Number(advance) +
          Number(month_1) +
          Number(month_2) +
          Number(month_3) +
          Number(month_4_6) +
          Number(month_6plus);

        const remaining = Number(po_amount) - totalPaid;
        const percentage = Number(po_amount)
          ? (remaining / Number(po_amount)) * 100
          : 0;

        let color = "text-green-600";
        if (percentage > 50) {
          color = "text-red-600";
        } else if (percentage > 20) {
          color = "text-yellow-600";
        } else if (percentage > 0) {
          color = "text-blue-600";
        } else {
          color = "text-red-600";
        }

        return (
          <span className={`text-sm font-semibold ${color}`}>
            {percentage.toFixed(2)}%
          </span>
        );
      },
    },
  };

  const handleUpdate = async (
    rowId: string,
    changes: Partial<ExposureRequest>
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
    // <Layout title="K">
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">All Exposures</h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#129990]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <NyneOSTable
        data={data}
        filter={filteredData}
        columns={columns}
        setData={setData}
        defaultColumnVisibility={defaultVisibility}
        draggableColumns={[
          "reference_no",
          "type",
          "business_unit",
          "vendor_beneficiary",
          "po_currency",
          "maturity_expiry_date",
        ]}
        sortableColumns={[
          "po_amount",
          "reference_no",
          "type",
          "business_unit",
        ]}
        expandedRowConfig={expandedRowConfig}
        onUpdate={handleUpdate}
        className="mb-8"
      />
    </div>
    // </Layout>
  );
};

export default ExposureBucketing;
