import React, { useEffect, useState, useMemo } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Download, Trash2 } from "lucide-react";
import Layout from "../../common/Layout";
import NyneOSTable from "./ReusableTable";
import type { ColumnDef } from "@tanstack/react-table";

// Mock API URL
const cURLHOST = "http://localhost:3001/";


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
      uploaded_by: "j1"
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
    PageData : ExposureRequest[];
  };
  userJourney: {
    process: string;
    nextPageToCall: string;
    actionCalledFrom: string;
  };
}


// Define Interface according to the table Columns and Structure
interface ExposureRequest {
  id: string;
  refNo: string;
  type: string;
  bu: string;
  vendorBeneficiary: string;
  amount: number;
  currency: string;
  maturityExpiry: string;
  linkedId: string;
  detail?: string;
  status: string;
  UploadBy?: string;
  UploadDate?: string;
  checkerComments?: string;
}

const mockExposureRequests: ExposureRequest[] = [
  {
    id: "1",
    refNo: "REF12345",
    type: "Import",
    bu: "Finance",
    vendorBeneficiary: "Vendor A",
    amount: 10000,
    currency: "USD",
    maturityExpiry: "2025-12-31",
    linkedId: "LNK001",
    detail: "Payment for goods",
    status: "Pending",
    UploadBy: "John Doe",
    UploadDate: "2025-07-10",
    checkerComments: "Awaiting approval",
  },
  {
    id: "2",
    refNo: "REF67890",
    type: "Export",
    bu: "Sales",
    vendorBeneficiary: "Vendor B",
    amount: 25000,
    currency: "EUR",
    maturityExpiry: "2025-11-15",
    linkedId: "LNK002",
    status: "Approved",
    UploadBy: "Jane Smith",
    UploadDate: "2025-07-12",
    checkerComments: "All good",
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
  const [data, setData] = useState<ExposureRequest[]>([]);


  useEffect(() => {
    setIsLoading(true);

    fetchRenderVars()
      .then((renderVarsRes) => {
        setRenderVars(renderVarsRes);
        if (Array.isArray(renderVarsRes.PageData)) {
        setData(renderVarsRes.PageData);
      } else {
        setData(mockExposureRequests);
      }
      } )
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
        accessorKey: "refNo",
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
        accessorKey: "bu",
        header: "BU",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "vendorBeneficiary",
        header: "Vendor/Beneficiary",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: "currency",
        header: "Currency",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "maturityExpiry",
        header: "Maturity/Expiry",
        cell: ({ getValue }) => (
          <span className="text-gray-700">{getValue() as string}</span>
        ),
      },
      {
        accessorKey: "linkedId",
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
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                onClick={() =>  console.log("Download", item.id)}
              >
                <Download className="w-4 h-4 text-[#129990]" />
              </button>
              <button
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
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


  // Default column visibility
  const defaultVisibility: Record<string, boolean> = {
    select: true,
    refNo: false,
    type: false,
    bu: false,
    vendorBeneficiary: true,
    amount: true,
    currency: true,
    maturityExpiry: true,
    linkedId: false,
    status: true,
    actions: true,
  };


  //Configure the Expandable code
  const expandedRowConfig = {
    sections: [
      {
        title: "Details Information",
        fields: ["detail", "linkedId", "refNo", "type"],
      },
      {
        title: "Approval Information",
        fields: ["UploadBy", "UploadDate", "checkerComments", "status"],
      },
    ],
    editableFields: ["detail", "checkerComments", "status"],
    fieldLabels: {
      detail: "Detail",
      linkedId: "Linked ID",
      refNo: "Reference Number",
      type: "Transaction Type",
      UploadBy: "Uploaded By",
      UploadDate: "Upload Date",
      checkerComments: "Checker Comments",
      status: "Status",
    },
  };


  //Handle Updation in Editing Function
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

      <h3 className="text-xl font-bold mb-4">Exposure Requests</h3>


      {/* Define the Table Data */}
      <NyneOSTable
        data={data}
        columns={columns}
        defaultColumnVisibility={defaultVisibility}
        draggableColumns={[
          "refNo",
          "type",
          "bu",
          "vendorBeneficiary",
          "currency",
          "maturityExpiry",
        ]}
        sortableColumns={["amount", "refNo", "type", "bu", "status"]}
        expandedRowConfig={expandedRowConfig}
        onUpdate={handleUpdate}
        className="mb-8"
      />
    </Layout>
  );
};

export default AllUsers;
