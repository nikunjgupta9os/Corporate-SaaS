import axios from "axios";
import {
  Building,
  Building2,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Layout from "../common/Layout";

type ApprovalStatus = "pending" | "approved" | "rejected";

interface TreeNodeData {
  entity_id: string;
  entity_name: string;
  parentname: string | null;
  is_top_level_entity: boolean;
  address: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  registration_number: string | null;
  pan_gst: string | null;
  legal_entity_identifier: string | null;
  tax_identification_number: string | null;
  default_currency: string | null;
  associated_business_units?: string | null;
  reporting_currency: string | null;
  unique_identifier: string | null;
  legal_entity_type: string | null;
  fx_trading_authority: string | null;
  internal_fx_trading_limit: string | null;
  associated_treasury_contact: string | null;
  is_deleted: boolean;
  approval_status: string;
  level: string | null;
}

type TreeNodeType = {
  id: string;
  name: string;
  data: TreeNodeData;
  children?: TreeNodeType[];
};

// Node type configuration based on level
const getNodeConfig = (level: string) => {
  switch (level) {
    case "Level 1":
      return {
        icon: Building,
        bg: "bg-blue-50",
        border: "border-blue-200",
        text: "text-blue-800",
      };
    case "Level 2":
      return {
        icon: Building2,
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
      };
    case "Level 3":
      return {
        icon: Building2,
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
      };
    case "Level 4":
      return {
        icon: Building2,
        bg: "bg-purple-50",
        border: "border-purple-200",
        text: "text-purple-800",
      };
    default:
      return {
        icon: Building,
        bg: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-800",
      };
  }
};

const HierarchicalTree = () => {
  const [treeData, setTreeData] = useState<TreeNodeType | null>();
  const [isAllExpanded, setIsAllExpanded] = useState(true);
  const [selectedNode, setSelectedNode] = useState<TreeNodeType | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    // const saved = localStorage.getItem("treeData");
    // if (saved) {
    //   setTreeData(JSON.parse(saved));
    // } else {
      const syncAndFetchHierarchy = async () => {
        try {
          await axios.post(
            "https://backend-5n7t.onrender.com/api/entity/sync-relationships"
          );
          const response = await axios.get(
            "https://backend-5n7t.onrender.com/api/entity/hierarchy"
          );
          setTreeData(response.data);
        } catch (error) {
           console.error("❌ Error syncing or fetching hierarchy:", error);
          // Fallback mock data
          // setTreeData(response.data);
        }
      };
      syncAndFetchHierarchy();
    }
  // }
  , []);

  // Save to localStorage whenever treeData changes
  useEffect(() => {
    if (treeData) {
      localStorage.setItem("treeData", JSON.stringify(treeData));
    }
  }, [treeData]);

  // Helper functions
  const findNodeById = (
    node: TreeNodeType,
    nodeId: string
  ): TreeNodeType | null => {
    if (node.id === nodeId) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, nodeId);
        if (found) return found;
      }
    }
    return null;
  };

  const findNodeByIdUniversal = (
    node: TreeNodeType | TreeNodeType[],
    nodeId: string
  ): TreeNodeType | null => {
    if (Array.isArray(node)) {
      for (const n of node) {
        const found = findNodeByIdUniversal(n, nodeId);
        if (found) return found;
      }
      return null;
    }
    if (node.id === nodeId) return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeByIdUniversal(child, nodeId);
        if (found) return found;
      }
    }
    return null;
  };

  const getAllNodeIds = (
    node: TreeNodeType | TreeNodeType[] | null
  ): string[] => {
    if (!node) return [];
    if (Array.isArray(node)) {
      return node.flatMap(getAllNodeIds);
    }
    const ids = [node.id];
    if (node.children) {
      node.children.forEach((child) => {
        ids.push(...getAllNodeIds(child));
      });
    }
    return ids;
  };

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(getAllNodeIds(treeData))
  );

  // Effects
  useEffect(() => {
    if (treeData && selectedNode) {
      const node = findNodeByIdUniversal(treeData, selectedNode.id);
      setSelectedNode(node || null);
    }
  }, [treeData, selectedNode?.id]);

  // Node operations
  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      newSet.has(nodeId) ? newSet.delete(nodeId) : newSet.add(nodeId);
      return newSet;
    });
  };

  const toggleAllNodes = () => {
    if (isAllExpanded) {
      // Collapse: only keep root(s) expanded
      if (Array.isArray(treeData)) {
        setExpandedNodes(new Set(treeData.map((n) => n.id)));
      } else if (treeData) {
        setExpandedNodes(new Set([treeData.id]));
      }
    } else {
      // Expand: expand all nodes in current treeData
      setExpandedNodes(new Set(getAllNodeIds(treeData)));
    }
    setIsAllExpanded(!isAllExpanded);
  };

  const deleteNode = (
    nodeId: string,
    currentNode: TreeNodeType | null
  ): TreeNodeType | null => {
    if (!currentNode) return null;
    if (currentNode.id === nodeId) return null;
    if (currentNode.children) {
      const updatedChildren = currentNode.children
        .map((child) => deleteNode(nodeId, child))
        .filter((child): child is TreeNodeType => child !== null);
      return {
        ...currentNode,
        children: updatedChildren.length > 0 ? updatedChildren : undefined,
      };
    }
    return currentNode;
  };

  const updateApprovalStatus = (nodeId: string, status: ApprovalStatus) => {
    // Helper to recursively set status for all descendants
    const setStatusForAllDescendants = (
      node: TreeNodeType,
      status: ApprovalStatus
    ): TreeNodeType => ({
      ...node,
      data: {
        ...node.data,
        approval_status: status,
      },
      children: node.children?.map((child) =>
        setStatusForAllDescendants(child, status)
      ),
    });

    const updateStatus = (node: TreeNodeType): TreeNodeType => {
      if (node.id === nodeId) {
        if (status === "rejected") {
          return setStatusForAllDescendants(node, "rejected");
        } else {
          return {
            ...node,
            data: {
              ...node.data,
              approval_status: status,
            },
          };
        }
      }
      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateStatus),
        };
      }
      return node;
    };

    if (Array.isArray(treeData)) {
      setTreeData(treeData.map(updateStatus));
    } else if (treeData) {
      setTreeData(updateStatus(treeData));
    }
  };

  const approveAllNodes = () => {
    const approveAll = (node: TreeNodeType): TreeNodeType => {
      return {
        ...node,
        data: {
          ...node.data,
          approval_status: "approved",
        },
        children: node.children?.map(approveAll),
      };
    };

    if (treeData) {
      setTreeData(approveAll(treeData));
    }
  };

  // Component for rendering node details
  const TreeNodeDetails = ({ node }: { node: TreeNodeType }) => {
    const isLevel1 = node.data.level === "Level 1";
    const config = getNodeConfig(node.data.level);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ ...node.data });

    useEffect(() => {
      setFormData({ ...node.data });
      setEditing(false);
    }, [node]);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
      // You can add logic to update the node in the tree here
      setEditing(false);
      // Optionally, call a prop or context to update the treeData
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{node.name} Details</h2>
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
            onClick={() => setEditing((prev) => !prev)}
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>
        {editing ? (
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLevel1 ? (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-gray-500">
                      Company Name
                    </label>
                    <input
                      name="entity_name"
                      value={formData.entity_name}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Address
                    </label>
                    <input
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Contact Number
                    </label>
                    <input
                      name="contact_phone"
                      value={formData.contact_phone || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Contact Email
                    </label>
                    <input
                      name="contact_email"
                      value={formData.contact_email || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Registration Number
                    </label>
                    <input
                      name="registration_number"
                      value={formData.registration_number || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-gray-500">
                      PAN/GST
                    </label>
                    <input
                      name="pan_gst"
                      value={formData.pan_gst || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Legal Entity Identifier
                    </label>
                    <input
                      name="legal_entity_identifier"
                      value={formData.legal_entity_identifier || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Tax Identification Number
                    </label>
                    <input
                      name="tax_identification_number"
                      value={formData.tax_identification_number || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Default Currency
                    </label>
                    <input
                      name="default_currency"
                      value={formData.default_currency || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Business Units
                    </label>
                    <input
                      name="associated_business_units"
                      value={
                        formData.associated_business_units?.join(", ") || ""
                      }
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-gray-500">
                      Entity Name
                    </label>
                    <input
                      name="entity_name"
                      value={formData.entity_name}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Parent
                    </label>
                    <input
                      name="parentname"
                      value={formData.parentname || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Address
                    </label>
                    <input
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Contact Number
                    </label>
                    <input
                      name="contact_phone"
                      value={formData.contact_phone || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Contact Email
                    </label>
                    <input
                      name="contact_email"
                      value={formData.contact_email || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="font-semibold text-gray-500">
                      Unique Identifier
                    </label>
                    <input
                      name="unique_identifier"
                      value={formData.unique_identifier || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Legal Entity Type
                    </label>
                    <input
                      name="legal_entity_type"
                      value={formData.legal_entity_type || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Reporting Currency
                    </label>
                    <input
                      name="reporting_currency"
                      value={formData.reporting_currency || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      FX Authority
                    </label>
                    <input
                      name="fx_trading_authority"
                      value={formData.fx_trading_authority || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      FX Limit
                    </label>
                    <input
                      name="internal_fx_trading_limit"
                      value={formData.internal_fx_trading_limit || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500">
                      Treasury Contact
                    </label>
                    <input
                      name="associated_treasury_contact"
                      value={formData.associated_treasury_contact || ""}
                      onChange={handleChange}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                </div>
              </>
            )}
            <div className="col-span-2 flex justify-end mt-4">
              <button
                type="button"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLevel1 ? (
              <>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Company Name
                    </h3>
                    <p>{node.data.entity_name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">Address</h3>
                    <p>{node.data.address}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Contact Number
                    </h3>
                    <p>{node.data.contact_phone}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Contact Email
                    </h3>
                    <p>{node.data.contact_email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Registration Number
                    </h3>
                    <p>{node.data.registration_number}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-500">PAN/GST</h3>
                    <p>{node.data.pan_gst}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Legal Entity Identifier
                    </h3>
                    <p>{node.data.legal_entity_identifier}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Tax Identification Number
                    </h3>
                    <p>{node.data.tax_identification_number}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Default Currency
                    </h3>
                    <p>{node.data.default_currency}</p>
                  </div>
                  <div>
                    {/* <h3 className="font-semibold text-gray-500">Business Units</h3>
                    <p>{node.data.associated_business_units?.join(", ")}</p> */}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-500">Entity Name</h3>
                    <p>{node.data.entity_name}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">Parent</h3>
                    <p>{node.data.parentname}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">Address</h3>
                    <p>{node.data.address}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Contact Number
                    </h3>
                    <p>{node.data.contact_phone}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Contact Email
                    </h3>
                    <p>{node.data.contact_email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Unique Identifier
                    </h3>
                    <p>{node.data.unique_identifier}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Legal Entity Type
                    </h3>
                    <p>{node.data.legal_entity_type}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Reporting Currency
                    </h3>
                    <p>{node.data.reporting_currency}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      FX Authority
                    </h3>
                    <p>{node.data.fx_trading_authority}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">FX Limit</h3>
                    <p>{node.data.internal_fx_trading_limit}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500">
                      Treasury Contact
                    </h3>
                    <p>{node.data.associated_treasury_contact}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // TreeNode component
  const TreeNode = ({
    node,
    level = 0,
  }: {
    node: TreeNodeType;
    level?: number;
  }) => {
    const hasChildren = node.children?.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const config = getNodeConfig(node.data.level);
    const Icon = config.icon;
    const status = node.data.approval_status;

    return (
      <div className="relative">
        <div
          className={`flex items-center gap-4 mb-6`}
          style={{ marginLeft: level * 10, cursor: "pointer" }}
          onClick={() => setSelectedNode(node)}
        >
          <div
            className={`relative flex items-center gap-0 p-0 rounded-lg border-2 w-[400px] hover:shadow-md transition-all ${config.border} bg-white`}
          >
            {/* Colored left strip */}
            <div className={`w-2 h-full rounded-l-md ${config.bg}`}></div>

            {/* Main content area */}
            <div className="flex items-center gap-2 p-3 flex-grow">
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleNode(node.id);
                  }}
                  className={`p-1 rounded-full ${config.bg} hover:opacity-80`}
                  aria-label={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <ChevronDown size={16} className={config.text} />
                  ) : (
                    <ChevronRight size={16} className={config.text} />
                  )}
                </button>
              )}

              <Icon size={16} className={config.text} />
              <span className={`font-medium flex-grow ${config.text}`}>
                {node.name}
              </span>

              <div className="flex items-center gap-1 ml-2">
                <div className="absolute -right-2.5 -top-4">
                  <span
                    className={`px-2 py-0.5 font-bold rounded-xl border-2 text-xs ${
                      status === "approved"
                        ? "bg-green-500 border-green-600 text-white"
                        : status === "rejected"
                        ? "bg-red-500 border-red-600 text-white"
                        : "bg-gray-200 border-gray-400 text-gray-600"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                     console.log(`View ${node.name}`);
                  }}
                  className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                >
                  <Edit className="text-primary" size={16} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      window.confirm(
                        `Delete ${node.name} and all its children?`
                      )
                    ) {
                      setTreeData((prev) => deleteNode(node.id, prev));
                      if (selectedNode?.id === node.id) {
                        setSelectedNode(null);
                      }
                    }
                  }}
                  className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                >
                  <Trash2 className="text-red-500" size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="ml-8 pl-6">
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Layout title="Entity Hierarchy" showButton buttonText="Entity Creation">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="w-full">
          <div className="flex space-x-4 w-full">
            {/* Left panel (tree view) */}
            <div className="bg-white w-full mt-6 rounded-lg border border-gray-200 p-6">
              <div className="flex flex-col space-y-2">
                {/* <label className="text-sm font-medium text-black">
                  Select Company
                </label> */}
                {/* <select className="text-black bg-white px-3 py-2 border border-border rounded-lg shadow-sm focus:outline-none">
                  <option value="globalcorp">GlobalCorp</option>
                </select> */}
              </div>
              <div className="flex justify-between items-center mt-6 border-b mb-8 pb-2">
                <h2 className="text-xl font-semibold">Hierarchy Tree</h2>
                <div className="flex items-center gap-2">
                  {/* <button
                    className="p-1 rounded hover:bg-white/50 transition-colors text-red-600 hover:text-red-800"
                    aria-label="Delete"
                    onClick={() => {
                      if (window.confirm("Delete entire hierarchy?")) {
                        setTreeData(null);
                        setSelectedNode(null);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button> */}
                  <button
                    onClick={toggleAllNodes}
                    className="px-2 py-1 text-[12px] bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {isAllExpanded ? "Collapse All" : "Expand All"}
                  </button>
                </div>
              </div>
              {Array.isArray(treeData) ? (
                treeData.map((node) => <TreeNode key={node.id} node={node} />)
              ) : treeData ? (
                <TreeNode node={treeData} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hierarchy data available. Create a new one.
                </div>
              )}
            </div>

            {/* Right panel (details and actions) */}
            <div className="flex flex-col bg-white mt-6 w-full space-y-10 rounded-lg border border-gray-200 p-6">
              {selectedNode ? (
                <>
                  <div className="bg-white mt-6 w-full rounded-lg border border-gray-200 p-6">
                    {selectedNode && (
                      <h3 className="font-semibold text-gray-700">
                        Current Node : {""} {selectedNode.id}
                      </h3>
                    )}
                    <div className="flex justify-end gap-2 ml-10 mt-4">
                      <button
                        onClick={() =>
                          updateApprovalStatus(selectedNode.id, "approved")
                        }
                        className="bg-primary hover:bg-primary-hover text-center text-white rounded px-4 py-2 font-bold transition min-w-[4rem]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateApprovalStatus(selectedNode.id, "rejected")
                        }
                        className="bg-primary hover:bg-primary-hover text-center text-white rounded px-4 py-2 font-bold transition min-w-[4rem]"
                      >
                        Reject
                      </button>
                      {/* <button className="bg-primary hover:bg-primary-hover text-center text-white rounded px-4 py-2 font-bold transition min-w-[4rem]">
                        Save Draft
                      </button> */}
                    </div>
                    <div className="mb-3">
                      <label className="block font-semibold mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        className="w-full text-black bg-white px-3 py-2 border border-border rounded-lg shadow-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        {selectedNode && (
                          <p className="text-sm text-gray-600">
                            Parent: {selectedNode.data.parentname || "None"}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {/* <button
                          onClick={approveAllNodes}
                          className="bg-primary hover:bg-primary-hover text-white rounded px-4 py-2 font-bold transition min-w-[4rem]"
                        >
                          Approve Entity Structure
                        </button>
                        <button className="bg-primary hover:bg-primary-hover text-white rounded px-4 py-2 font-bold transition min-w-[4rem]">
                          Save Progress
                        </button> */}
                      </div>
                    </div>
                  </div>
                  <TreeNodeDetails node={selectedNode} />
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a node to view details
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HierarchicalTree;
