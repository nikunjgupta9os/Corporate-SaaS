import React, { useEffect, useState, useMemo } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Download, Trash2, Upload } from "lucide-react";
// import Layout from "../../common/Layout";
import NyneOSTable from "./ReusableTable";
import type { ColumnDef } from "@tanstack/react-table";
import { exportToExcel } from "../../ui/exportToExcel";

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
      po_amount: 150000.75,
      po_currency: "USD",
      maturity_expiry_date: "2025-08-29T18:30:00.000Z",
      linked_id: "LINK-123",
      status: "Pending",
      file_reference_id: "FILE-789",
      upload_date: "2025-07-13T18:30:00.000Z",
      purchase_invoice: "INV-456",
      po_date: "2025-07-09T18:30:00.000Z",
      shipping_bill_date: "2025-07-11T18:30:00.000Z",
      supplier_name: "Acme Global Supplies",
      expected_payment_date: "2025-09-14T18:30:00.000Z",
      comments: "Urgent payment for Q3 stock",
      created_at: "2025-07-14T04:30:00.000Z",
      updated_at: "2025-07-14T06:30:00.000Z",
      po_detail: "Purchase of office supplies and equipment",
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

interface ExposureRequest {
  id: string;
  reference_no: string;
  type: string;
  business_unit: string;
  vendor_beneficiary: string;
  po_amount: number;
  po_detail?: string;
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

const AllExposureRequest: React.FC = () => {
  const [renderVars, setRenderVars] = useState<IfPayload["renderVars"] | null>(
    null
  );
  const [userVars, setUserVars] = useState<IfPayload["userVars"] | null>(null);
  const [userJourney, setUserJourney] = useState<
    IfPayload["userJourney"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<ExposureRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");

  const statusOptions = useMemo(() => {
    const options = new Set<string>();
    data.forEach((user) => {
      if (user.status) options.add(user.status);
    });
    return ["All", ...Array.from(options)];
  }, [data]);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item) => {
        return Object.values(item)
          .filter(Boolean)
          .some((val) => String(val).toLowerCase().includes(lowerSearch));
      });
    }

    if (statusFilter !== "All") {
      result = result.filter((item) => item.status === statusFilter);
    }

    return result;
  }, [data, searchTerm, statusFilter]);

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

  

  const columns = useMemo<ColumnDef<ExposureRequest>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
          />
        ),
        size: 50,
      },
      {
        accessorKey: "reference_no",
        header: "Ref No",
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "business_unit",
        header: "BU",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "vendor_beneficiary",
        header: "Vendor/Beneficiary",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },

      {
        accessorKey: "po_amount",
        header: "Amount",
        cell: ({ getValue }) => {
          const amount = Number(getValue());
          return (
            <span className="font-medium text-gray-900">
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
        accessorKey: "po_detail",
        header: "PO Detail",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "po_currency",
        header: "Currency",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "maturity_expiry_date",
        header: "Maturity/Expiry",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
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
        accessorKey: "file_reference_id",
        header: "File Ref ID",
        cell: ({ getValue }) => (
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "upload_date",
        header: "Upload Date",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return (
            <span className="text-gray-700">
              {isNaN(date.getTime()) ? "—" : date.toLocaleDateString()}
            </span>
          );
        },
      },
      {
        accessorKey: "purchase_invoice",
        header: "Purchase Invoice",
        cell: ({ getValue }) => (
          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
            {getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "po_date",
        header: "PO Date",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return (
            <span className="text-gray-700">
              {isNaN(date.getTime()) ? "—" : date.toLocaleDateString()}
            </span>
          );
        },
      },
      {
        accessorKey: "shipping_bill_date",
        header: "Shipping Bill Date",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return (
            <span className="text-gray-700">
              {isNaN(date.getTime()) ? "—" : date.toLocaleDateString()}
            </span>
          );
        },
      },
      {
        accessorKey: "supplier_name",
        header: "Supplier Name",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "expected_payment_date",
        header: "Expected Payment Date",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return (
            <span className="text-gray-700">
              {isNaN(date.getTime()) ? "—" : date.toLocaleDateString()}
            </span>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return (
            <span className="text-gray-700">
              {isNaN(date.getTime()) ? "—" : date.toLocaleDateString()}
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
    maturity_expiry_date: false,
    linked_id: false,
    status: true,
    po_detail: false,
    file_reference_id: false,
    upload_date: false,
    purchase_invoice: false,
    po_date: false,
    shipping_bill_date: false,
    supplier_name: false,
    expected_payment_date: false,
    comments: false,
    created_at: false,
    updated_at: false,
    uploaded_by: false,
    // actions: true, // custom column
  };

  const expandedRowConfig = {
    sections: [
      {
        title: "PO Details",
        fields: [
          "po_detail",
          "linked_id",
          "po_date",
          "purchase_invoice",
          "shipping_bill_date",
          "supplier_name",
          "expected_payment_date",
        ],
      },
      {
        title: "Approval Information",
        fields: [
          "uploaded_by",
          "upload_date",
          "comments",
          "file_reference_id",
          "created_at",
          "updated_at",
        ],
      },
    ],
    editableFields: [
      "po_detail",
      "comments",
      "status",
      "expected_payment_date",
    ],
    fieldLabels: {
      reference_no: "Reference Number",
      type: "Transaction Type",
      business_unit: "Business Unit",
      vendor_beneficiary: "Vendor/Beneficiary",
      po_amount: "PO Amount",
      po_currency: "PO Currency",
      maturity_expiry_date: "Maturity/Expiry Date",
      linked_id: "Linked ID",
      status: "Status",
      po_detail: "PO Details",
      file_reference_id: "File Reference ID",
      upload_date: "Upload Date",
      purchase_invoice: "Purchase Invoice",
      po_date: "PO Date",
      shipping_bill_date: "Shipping Bill Date",
      supplier_name: "Supplier Name",
      expected_payment_date: "Expected Payment Date",
      comments: "Checker Comments",
      created_at: "Created At",
      updated_at: "Updated At",
      uploaded_by: "Uploaded By",
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
    <div className="space-y-6">

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

        <div></div>
        <div></div>

        {/* Search and Action Buttons */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            className="flex items-center justify-center border border-[#129990] rounded-lg px-2 h-10 text-sm hover:bg-[#e6f7f5] transition"
            title="Download All Roles"
            onClick={() => exportToExcel(filteredData, "All_Roles")}
          >
            <Upload className="flex item-center justify-center text-[#129990]" />
          </button>
          <button
            type="button"
            className="flex items-center justify-center border border-[#129990] rounded-lg w-10 h-10 hover:bg-[#e6f7f5] transition"
            title="Refresh"
            onClick={() => window.location.reload()}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="#129990"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.36 5.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>
          <form
            className="relative flex items-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Search"
              className="pl-4 pr-10 py-2 border border-[#129990] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#129990]/30 min-w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#129990]"
              tabIndex={-1}
              aria-label="Search"
            >
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="#129990"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
          </form>
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
          "po_amount",
          "po_currency",
          "maturity_expiry_date",
          "status",
        ]}
        edit={true}
        sortableColumns={[
          "reference_no",
          "type",
          "business_unit",
          "po_amount",
          "maturity_expiry_date",
          "upload_date",
          "status",
        ]}
        expandedRowConfig={expandedRowConfig}
        onUpdate={handleUpdate}
        className="mb-8"
      />
    </div>
  );
};

export default AllExposureRequest;
