import React, { useEffect, useState, useMemo } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Download, Trash2 } from "lucide-react";
import Layout from "../../common/Layout";
import NyneOSTable from "./ReusableTable";
import type { ColumnDef } from "@tanstack/react-table";
import "../styles/theme.css";


const cURLHOST = "https://backend-5n7t.onrender.com/api";

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
  pageData: [
    {
      id: "1",
      reference_no: "REF-20250714-001",
      type: "PO",
      business_unit: "BU-Mumbai",
      vendor_beneficiary: "VEND-001",
      po_amount: "150000.75",
      po_currency: "USD",
      maturity_expiry_date: "2025-08-29T18:30:00.000Z",
      linked_id: "LINK-123",
      status: "Pending",
      //   file_reference_id: "FILE-789",
      upload_date: "2025-07-13T18:30:00.000Z",
      //   purchase_invoice: "INV-456",
      //   po_date: "2025-07-09T18:30:00.000Z",
      //   shipping_bill_date: "2025-07-11T18:30:00.000Z",
      //   supplier_name: "Acme Global Supplies",
      //   expected_payment_date: "2025-09-14T18:30:00.000Z",
      comments: "Urgent payment for Q3 stock",
      //   created_at: "2025-07-14T04:30:00.000Z",
      //   updated_at: "2025-07-14T06:30:00.000Z",
      uploaded_by: "j1",
    },
  ],
};
const fallbackUserJourney: IfPayload["userJourney"] = {
  process: "Init",
  nextPageToCall: "/dashboard",
  actionCalledFrom: "login",
};

async function fetchRenderVars(): Promise<IfPayload["renderVars"]> {
  const res = await fetch(`${cURLHOST}/exposureUpload/renderVars`);
  if (!res.ok) throw new Error("Failed to fetch renderVars");
  return res.json();
}

async function fetchUserVars(): Promise<IfPayload["userVars"]> {
  const res = await fetch(`${cURLHOST}/exposureUpload/userVars`);
  if (!res.ok) throw new Error("Failed to fetch userVars");
  return res.json();
}

async function fetchUserJourney(): Promise<IfPayload["userJourney"]> {
  const res = await fetch(`${cURLHOST}/exposureUpload/userJourney`);
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

// interface ExposureRequest {
//   id: string;
//   reference_no: string;
//   type: string;
//   business_unit: string;
//   vendor_beneficiary: string;
//   po_amount: string;
//   po_currency: string;
//   maturity_expiry_date: string;
//   linked_id: string;
// //   detail?: string;
//   status: string;
//   uploaded_by?: string;
//   upload_date?: string;
//   comments?: string;
// }

// interface ExposureRequest {
//   id: string;
//   reference_no: string;
//   type: string;
//   business_unit: string;
//   vendor_beneficiary: string;
//   po_amount: number;
//   po_currency: string;
//   maturity_expiry_date: string;
//   linked_id: string;
//   status: string;
//   file_reference_id?: string;
//   upload_date: string;
//   purchase_invoice?: string;
//   po_date?: string;
//   shipping_bill_date?: string;
//   supplier_name?: string;
//   expected_payment_date?: string;
//   comments: string;
//   created_at ? : string;
//   updated_at?: string;
//   uploaded_by: string;
// }
interface ExposureRequest {
  id: string;
  reference_no: string;
  type: string;
  business_unit: string;
  vendor_beneficiary: string;
  po_amount: string; // updated to string (as per real response)
  po_currency: string;
  maturity_expiry_date: string;
  linked_id: string;
  status: string;
  file_reference_id?: string;
  upload_date?: string;
  purchase_invoice?: string;
  po_date?: string;
  shipping_bill_date?: string;
  supplier_name?: string;
  expected_payment_date?: string;
  comments?: string;
  created_at?: string;
  updated_at?: string;
  uploaded_by?: string;
}

const mockExposureRequests: ExposureRequest[] = [
  {
    id: "1",
    reference_no: "REF12345",
    type: "Import",
    business_unit: "Finance",
    vendor_beneficiary: "Vendor A",
    po_amount: "10000",
    po_currency: "USD",
    maturity_expiry_date: "2025-12-31",
    linked_id: "LNK001",
    // detail: "Payment for goods",
    status: "Pending",
    uploaded_by: "John Doe",
    upload_date: "2025-07-10",
    comments: "Awaiting approval",
  },
  {
    id: "2",
    reference_no: "REF67890",
    type: "Export",
    business_unit: "Sales",
    vendor_beneficiary: "Vendor B",
    po_amount: "25000",
    po_currency: "EUR",
    maturity_expiry_date: "2025-11-15",
    linked_id: "LNK002",
    status: "Approved",
    uploaded_by: "Jane Smith",
    upload_date: "2025-07-12",
    comments: "All good",
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
  const [data, setData] = useState<ExposureRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
// const [originalData, setOriginalData] = useState<ExposureRequest[]>([]); // Store original unfiltered data
  

  const statusOptions = useMemo(() => {
      const options = new Set<string>();
      data.forEach((user) => {
        if (user.status) options.add(user.status);
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
         result = result.filter((user) => user.status === statusFilter);
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
      .catch((err) => {
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
        header: "Ref No",
        cell: ({ getValue }) => (
          <span className="font-medium text-secondary-text-dark">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => (
          <span className="text-secondary-text">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "business_unit",
        header: "BU",
        cell: ({ getValue }) => (
          <span className="text-secondary-text">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "vendor_beneficiary",
        header: "Vendor/Beneficiary",
        cell: ({ getValue }) => (
          <span className="text-secondary-text">{getValue() as string}</span>
        ),
      },
      //   {
      //     accessorKey: "po_amount",
      //     header: "Amount",
      //     cell: ({ getValue }) => (
      //       <span className="font-medium text-gray-900">
      //         {new Intl.NumberFormat("en-US", {
      //           style: "currency",
      //           currency: "USD",
      //         }).format(getValue() as number)}
      //       </span>
      //     ),
      //   },
      {
        accessorKey: "po_amount",
        header: "Amount",
        cell: ({ getValue }) => {
          const amount = Number(getValue());
          return (
            <span className="font-medium text-secondary-text-dark ">
              {isNaN(amount)
                ? "-"
                : new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(amount)}
            </span>
          );
        },
      },
      {
        accessorKey: "po_currency",
        header: "Currency",
        cell: ({ getValue }) => (
          <span className="text-secondary-text">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "maturity_expiry_date",
        header: "Maturity/Expiry",
        cell: ({ getValue }) => (
          <span className="text-secondary-text">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "linked_id",
        header: "Linked ID",
        cell: ({ getValue }) => (
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const rawStatus = info.getValue();
          if (!rawStatus || typeof rawStatus !== "string") {
            return (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-500">
                —
              </span>
            );
          }

          const status =
            rawStatus.charAt(0).toUpperCase() +
            rawStatus.slice(1).toLowerCase();
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
      {
        accessorKey: "actions",
        header: "Action",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex items-center space-x-1">
              <button
                className="p-1.5 hover:bg-primary-xl rounded transition-colors"
                onClick={() =>  console.log("Download", item.id)}
              >
                <Download className="w-4 h-4 text-[#129990]" />
              </button>
              <button
                className="p-1.5 hover:bg-primary-xl rounded transition-colors"
                onClick={() =>  console.log("Delete", item.id)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
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
    linked_id: false,
    status: true,
    actions: true,
  };

  const expandedRowConfig = {
    sections: [
      {
        title: "Details Information",
        fields: ["detail", "linked_id", "reference_no", "type"],
      },
      {
        title: "Approval Information",
        fields: ["uploaded_by", "upload_date", "comments", "status"],
      },
    ],
    editableFields: ["detail", "comments", "status"],
    fieldLabels: {
      detail: "Detail",
      linked_id: "Linked ID",
      reference_no: "Reference Number",
      type: "Transaction Type",
      uploaded_by: "Uploaded By",
      upload_date: "Upload Date",
      comments: "Checker Comments",
      status: "Status",
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
    <Layout title="K">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">All Users</h2>

        <div className="space-y-6 bg-gray-50 rounded-lg shadow p-4 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">User Vars</h3>
            <pre className="bg-white p-3 rounded-md overflow-x-auto border border-gray-300">
              {JSON.stringify(userVars, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">Render Vars</h3>
            <pre className="bg-white p-3 rounded-md overflow-x-auto border border-gray-300">
              {JSON.stringify(renderVars, null, 2)}
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">User Journey</h3>
            <pre className="bg-white p-3 rounded-md overflow-x-auto border border-gray-300">
              {JSON.stringify(userJourney, null, 2)}
            </pre>
          </div>
        </div>

        <h3 className="text-xl text-secondary-text font-bold mb-4">Exposure Requests</h3>

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
            "status",
          ]}
          expandedRowConfig={expandedRowConfig}
          onUpdate={handleUpdate}
          className="mb-8"
        />
      </div>
    </Layout>
  );
};

export default AllUsers;
