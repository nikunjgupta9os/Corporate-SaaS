  import React, { useState, useEffect } from "react";
  import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    getExpandedRowModel,
    getSortedRowModel,
    type ColumnDef,
    type Row,
    type HeaderContext,
  } from "@tanstack/react-table";
  import { DndContext, type DragEndEvent } from "@dnd-kit/core";
  import { Draggable } from "../../common/Draggable";
  import { Droppable } from "../../common/Droppable";
  import { ChevronDown, ChevronUp, CircleArrowUp, CircleArrowDown } from "lucide-react";
  import Button from "../../ui/Button";
  import "../../styles/theme.css";
  import axios from "axios";
import { useNotification } from "../../Notification/Notification.tsx";
  interface EditableRowData {
    id: string;
    [key: string]: any;
  }

  interface ExpandedRowConfig {
    sections: {
      title: string;
      fields: string[];
    }[];
    editableFields?: string[];
    fieldLabels?: Record<string, string>;
    customRender?: (row: Row<any>) => React.ReactNode;
    customRenderPerField?: Record<string, (row: Row<any>) => React.ReactNode>; // ✅ NEW
  }

  const dropdownOptions: Record<string, string[]> = {
    inco: ["FOB", "CIF", "EXW", "DDP"],
  };



  interface TableProps<T extends EditableRowData> {
    data: T[];
    filter ? : T[];
    columns: ColumnDef<T>[];
    defaultColumnVisibility?: Record<string, boolean>;
    draggableColumns?: string[]; 
    sortableColumns?: string[]; 
    expandedRowConfig?: ExpandedRowConfig;
    onUpdate?: (rowId: string, changes: Partial<T>) => Promise<boolean>;
    className?: string;
    setData ? : (data: T[]) => void; // Optional prop to update data
  }

  interface ExpandedRowProps<T extends EditableRowData> {
    row: Row<T>;
    config: ExpandedRowConfig;
    onUpdate?: (rowId: string, changes: Partial<T>) => Promise<boolean>;
    visibleColumnCount: number;
  }

  function ExpandedRow<T extends EditableRowData>({
    row,
    config,
    onUpdate,
    visibleColumnCount,
  }: ExpandedRowProps<T>) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState<Partial<T>>({});

    const handleChange = (key: keyof T, value: any) => {
      setEditValues((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

    const getChangedFields = (original: T, edited: Partial<T>): Partial<T> => {
      const changes: Partial<T> = {};
      for (const key in edited) {
        if (edited[key] !== original[key]) {
          changes[key] = edited[key];
        }
      }
      return changes;
    };

    const handleEditToggle = async () => {
      if (isEditing) {
        const changedFields = getChangedFields(row.original, editValues);

        if (Object.keys(changedFields).length === 0) {
          setIsEditing(false);
          return;
        }

        // Use reference_no instead of id for API call
        const referenceNo = row.original.reference_no || row.original.id;
        try {
          const response = await fetch(`https://backend-5n7t.onrender.com/api/exposureBucketing/${referenceNo}/edit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              reference_no: referenceNo,
              comments: changedFields.comments,
              inco: changedFields.inco,
              advance: changedFields.advance,
              month_1: changedFields.month_1,
              month_2: changedFields.month_2,
              month_3: changedFields.month_3,
              month_4_6: changedFields.month_4_6,
              month_6plus: changedFields.month_6plus,
            }),
          });

          const result = await response.json();

          if (response.ok && result.success) {
            Object.assign(row.original, result.updated);
            setIsEditing(false);
          } else {
             console.error("Failed to update exposure:", result.error);
            // Optional: show toast or error message to user
          }
        } catch (error) {
           console.error("Error during update:", error);
        }
      } else {
        setEditValues({ ...row.original });
        setIsEditing(true);
      }
    };


    const renderField = (key: string) => {
      const label = config.fieldLabels?.[key] ?? key;
      const isEditable = config.editableFields?.includes(key) ?? false;
      const originalValue = row.original[key as keyof T];
      const value = isEditing ? editValues[key as keyof T] : originalValue;

      // Fix: Only use dropdown for 'inco' column
      return (
        <div key={key} className="flex flex-col space-y-1">
          <label className="font-bold text-secondary-text">{label}</label>

          {isEditing && isEditable ? (
            key === "inco" ? (
              <>
                <select
                  className="border rounded px-2 py-1 text-sm bg-white shadow-sm"
                  value={String(editValues[key as keyof T] ?? "")}
                  onChange={(e) => handleChange(key as keyof T, e.target.value)}
                >
                  <option value="">Select</option>
                  {dropdownOptions.inco.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500">
                  Old: {originalValue ?? "—"}
                </span>
              </>
            ) : typeof originalValue === "boolean" ? (
              <>
                <select
                  className="border rounded px-2 py-1 text-sm bg-white shadow-sm"
                  value={String(editValues[key as keyof T])}
                  onChange={(e) =>
                    handleChange(key as keyof T, e.target.value === "true")
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <span className="text-xs text-gray-500">
                  Old: {String(originalValue)}
                </span>
              </>
            ) : (
              <>
                <input
                  className="border rounded px-2 py-1 text-sm bg-white shadow-sm"
                  value={String(value || "")}
                  onChange={(e) => handleChange(key as keyof T, e.target.value)}
                />
                <span className="text-xs text-gray-500">
                  Old: {String(originalValue ?? "—")}
                </span>
              </>
            )
          ) : (
            config.customRenderPerField?.[key] ? (
              config.customRenderPerField[key](row)
            ) : (
              <span className="font-medium text-primary-lt">
                {String(value ?? "—")}
              </span>
            )
          )}
        </div>
      );
    };


    return (
      <tr key={`${row.id}-expanded`}>
        <td colSpan={visibleColumnCount} className="px-6 py-4 bg-primary-md">
          <div className="bg-secondary-color-lt rounded-lg p-4 shadow-md border border-border">
          <div className="flex justify-end items-end mb-4">
    <Button 
      onClick={handleEditToggle}
      categories="Medium"
      // className="text-sm px-3 py-1"
    >
      {isEditing ? "Save" : "Edit"}
    </Button>
  </div>

            {config.sections.map((section) => (
              <div key={section.title} className="mb-6">
                <h5 className="text-md font-medium text-primary mb-3 border-b border-primary-md pb-2">
                  {section.title}
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {section.fields.map(renderField)}
                </div>
              </div>
            ))}

            {config.sections.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No additional information to display
              </div>
            )}
          </div>
        </td>
      </tr>
    );
  }

  // Main Table Component
  // Main Table Component
  function NyneOSTable<T extends EditableRowData>({
    data,
    filter,
    columns,
    defaultColumnVisibility = {},
    draggableColumns = [],
    sortableColumns = [],
    expandedRowConfig,
    onUpdate,
    className = "",
    setData,
  }: TableProps<T>) {
    const [columnOrder, setColumnOrder] = useState<string[]>([]);
    const [columnVisibility, setColumnVisibility] = useState(defaultColumnVisibility);
    const [sorting, setSorting] = useState<any[]>([]);
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});

    // Set all rows to be expanded by default when the component mounts or data changes
    useEffect(() => {
      if (expandedRowConfig) {
        const initialExpandedState: Record<string, boolean> = {};
        (filter || data).forEach((item) => {
          initialExpandedState[item.id] = true;
        });
        setExpanded(initialExpandedState);
      }
    }, [data, filter, expandedRowConfig]);

    // Enhanced columns with sorting capability
    const enhancedColumns: ColumnDef<T>[] = columns.map((col) => {
      const columnId = col.id || (col as any).accessorKey;
      
      if (sortableColumns.includes(columnId)) {
        return {
          ...col,
          enableSorting: true,
          sortDescFirst: false, 
          header: ({ column }: HeaderContext<T, unknown>) => (
            <div className="flex items-center space-x-2">
              <span>{typeof col.header === 'function' ? 'Sort' : (col.header as React.ReactNode)}</span>
              <button
                onClick={() => {
                  const currentSort = column.getIsSorted();
                  if (currentSort === false) {
                    column.toggleSorting(false);
                  } else if (currentSort === "asc") {
                    column.toggleSorting(true); 
                  } else {
                    column.toggleSorting(false); 
                  }
                }}
                className="flex items-center"
              >
                {column.getIsSorted() === "asc" ? (
                  <CircleArrowUp className="text-primary w-4 h-4" />
                ) : column.getIsSorted() === "desc" ? (
                  <CircleArrowDown className="w-4 h-4" />
                ) : (
                  <div className="flex flex-col">
                    <CircleArrowUp className="text-primary w-4 h-4 mb-[-2px] opacity-50" />
                  </div>
                )}
              </button>
            </div>
          ),
        } as ColumnDef<T>;
      }
      return col;
    });

    const finalColumns: ColumnDef<T>[] = expandedRowConfig ? [
      ...enhancedColumns,
      {
        id: "expand",
        header: () => (
          <div className="p-2 flex items-center justify-start">
            <ChevronDown className="w-4 h-4 text-primary" />
          </div>
        ),
        cell: ({ row }) => (
          <button
            onClick={() => row.getToggleExpandedHandler()()}
            className="p-2 hover:bg-primary-xl text-primary rounded-md transition-colors"
            aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
          >
            {row.getIsExpanded() ? (
              <ChevronUp className="w-4 h-4 text-primary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-primary" />
            )}
          </button>
        ),
      },
    ] : enhancedColumns;

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (active.id !== over?.id && draggableColumns.includes(active.id as string)) {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over?.id as string);
        const newOrder = [...columnOrder];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, active.id as string);
        setColumnOrder(newOrder);
      }
    };

    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
    const table = useReactTable({
      data: filter ? filter : data,
      columns: finalColumns,
      onColumnOrderChange: setColumnOrder,
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getExpandedRowModel: expandedRowConfig ? getExpandedRowModel() : undefined,
      getRowCanExpand: expandedRowConfig ? () => true : undefined,
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        columnOrder,
        columnVisibility,
        sorting,
        rowSelection,
        expanded, // Add the expanded state to the table
      },
      enableRowSelection: true, // Enable row selection
      onExpandedChange: setExpanded, // Add handler for expanded state changes
    });

    const {notify} = useNotification();


    useEffect(() => {
      if (columnOrder.length === 0) {
        setColumnOrder(table.getAllLeafColumns().map((col) => col.id));
      }
    }, [table, columnOrder]);

    // Rest of your component remains the same...
    const handleApprove = async () => {
    // Get selected row IDs
    const selectedUserIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);

    if (selectedUserIds.length === 0) {
      // alert("No users selected");
      notify("No users selected", "warning");
      return;
    }

    try {
      const response = await axios.post(
        "https://backend-5n7t.onrender.com/api/exposureBucketing/bulkApprove",
        {
          exposureIds: selectedUserIds,
          approved_by: localStorage.getItem("userEmail"),
          approval_comment: "Bulk user approval",
        }
      );

      if (response.data.success) {
        if (setData) {
          const updatedData = data.map((item) => {
            // Update status if item id is in selectedUserIds
            if (selectedUserIds.includes(item.id)) {
              return { ...item, status_bucketing: "Approved" }; // Update status or your relevant field
            }
            return item;
          });
          setData(updatedData);
        }

        setRowSelection({}); // Clear selection

        // alert(`${selectedUserIds.length} item(s) approved successfully`);
        notify(`${selectedUserIds.length} item(s) approved successfully`, "success");
      } else {
        throw new Error(response.data.message || "Approval failed");
      }
    } catch (error) {
       console.error("Approval error:", error);
      // alert("Failed to approve selected items");
      notify("Failed to approve selected items", "error");
    }
  };
  const handleReject = async () => {
  const selectedUserIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original.id);

  if (selectedUserIds.length === 0) {
    // alert("No users selected");
    notify("No users selected", "warning");
    return;
  }

  try {
    const response = await axios.post(
      "https://backend-5n7t.onrender.com/api/exposureBucketing/bulkReject",
      {
        exposureIds: selectedUserIds,
        rejected_by: localStorage.getItem("userEmail"),
        rejection_comment: "Bulk user rejection",
      }
    );

    if (response.data.success) {
      if (setData) {
        const updatedData = data.map((item) =>
          selectedUserIds.includes(item.id)
            ? { ...item, status_bucketing: "Rejected" }
            : item
        );
        setData(updatedData);
      }

      setRowSelection({}); // Clear selection

      // alert(`${selectedUserIds.length} item(s) rejected successfully`);
      notify(`${selectedUserIds.length} item(s) rejected successfully`, "success");
    } else {
      throw new Error(response.data.message || "Rejection failed");
    }
  } catch (error) {
     console.error("Rejection error:", error);
    // alert("Failed to reject selected items");
    notify("Failed to reject selected items", "error");
  }
};
    return (
      <>
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2 min-w-[12rem]">
            <Button onClick={handleApprove}>Approve</Button>
            <Button onClick={handleReject}>Reject</Button>

          </div>
          </div>
        
      <div className={`w-full overflow-x-auto ${className}`}>
        <div className=" shadow-lg border border-border">
          <DndContext onDragEnd={handleDragEnd}>
            <table className="min-w-full">
              <colgroup>
                {table.getVisibleLeafColumns().map((col) => (
                  <col key={col.id} className="font-medium" />
                ))}
              </colgroup>
              <thead className="bg-secondary-color rounded-xl">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => {
                      const isFirst = index === 0;
                      const isLast = index === headerGroup.headers.length - 1;
                      const isDraggable = draggableColumns.includes(header.column.id);
                      
                      return (
                        <th
                          key={header.id}
                          className="px-6 py-4 text-left text-xs font-semibold text-header-color uppercase tracking-wider border-b border-border"
                          style={{ width: header.getSize() }}
                        >
                          <Droppable id={header.column.id}>
                            {isFirst || isLast || !isDraggable ? (
                              <div className="px-1">
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </div>
                            ) : (
                              <Draggable id={header.column.id}>
                                <div className="cursor-move border-border text-header-color hover:bg-blue-100 rounded px-1 py-1 transition duration-150 ease-in-out">
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                </div>
                              </Draggable>
                            )}
                          </Droppable>
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={finalColumns.length}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center">
                        <p className="text-lg font-medium text-primary mb-1">
                          No data found
                        </p>
                        <p className="text-sm text-gray-500">
                          There is no data to display at the moment.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row,idx) => (
                    <React.Fragment key={row.id}>
                      <tr className={idx % 2 === 0 ?  "bg-primary-md"
                            : "bg-secondary-color-lt"}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-6 py-4 whitespace-nowrap text-sm border-b border-border"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                      {row.getIsExpanded() && expandedRowConfig && (
                        <ExpandedRow
                          row={row}
                          config={expandedRowConfig}
                          onUpdate={onUpdate}
                          visibleColumnCount={row.getVisibleCells().length}
                        />
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </DndContext>
        </div>
      </div>
      </>
    );
  }


  export default NyneOSTable;