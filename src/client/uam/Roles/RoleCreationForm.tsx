import Layout from "../../common/Layout";
// import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../Notification/Notification";
type FormData = {
  processname: string;
  authenticationType: string;
  employeeName: string;
  usernameOrEmployeeId: string;
  roleName: string;
  email: string;
  mobile: string;
  address: string;
  businessUnitName: string;
  officeStartTimeIST: string;
  officeEndTimeIST: string;
};
const RoleCreation: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [roles, setRoles] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [timeError, setTimeError] = useState("");
  const { notify } = useNotification();

  const onReset = () => {
    reset(); 
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.startTime || !form.endTime) {
      setFormError("All fields are required.");
      return;
    }

    if (form.startTime >= form.endTime) {
      setTimeError("Start time must be before end time.");
      return;
    }

    setFormError("");
    setTimeError("");

    const payload = {
      name: form.name,
      rolecode: form.name.toUpperCase().trim(),
      description: form.description,
      office_start_time_ist: form.startTime,
      office_end_time_ist: form.endTime,
      created_by: localStorage.getItem("userEmail"),
    };

    axios
      .post("https://backend-5n7t.onrender.com/api/roles/create", payload)
      .then((res) => {
        if (res.data.success) {
          setRoles((prev) =>
            [...prev, res.data.role].sort((a, b) =>
              a.name.localeCompare(b.name)
            )
          );
          setForm({ name: "", description: "", startTime: "", endTime: "" });
          // setShowForm(false);
          // alert("Role created successfully!");
          notify("Role created successfully!", "success");
        navigatee("/role");
        } else {
          // alert(
          //   "Failed to create role: " + (res.data.error || "Unknown error.")
          // );
          notify("Failed to create role: " + (res.data.error || "Unknown error."), "error");
        }
      })
      .catch((err) => {
        //  console.error("Error creating role:", err);
        // alert("Failed to create role.");
        notify("Failed to create role.", "error");
      });
  };
  const PageChange = () => {
    navigate("/role");
  };

  const [form, setForm] = useState({
    name: "",
    description: "",
    startTime: "",
    endTime: "",
  });
  const navigatee = useNavigate();
   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if ((name === "startTime" || name === "endTime") && form.startTime && form.endTime) {
      if (form.startTime >= form.endTime) {
        setTimeError("Start time must be before end time.");
      } else {
        setTimeError("");
      }
    }
  };

  return (
    <Layout
      title="Role Creation Form"
      showButton={true}
      buttonText="Back"
      onButtonClick={PageChange}
    >
      <div className="flex justify-center">
        <div className="p-6 rounded-xl border text-secondary-text border-border bg-secondary-color-lt shadow-md space-y-6 flex-shrink-0 w-full max-w-[1500px]">
          <h2 className="text-xl font-semibold text-secondary-text">Create User Form</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="block font-semibold mb-1">Role Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full text-secondary-text bg-secondary-color-lt px-3 py-2 border border-border rounded-lg shadow-sm focus:outline-none"
                required
              />
            </div>

            <div className="mb-3">
              <label className="block font-semibold mb-1">Description <span className="text-red-500">*</span></label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full text-secondary-text bg-secondary-color-lt px-3 py-2 border border-border rounded-lg shadow-sm focus:outline-none"
                required
              />
            </div>

            <div className="mb-3 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1">
                  Office Start Time (IST) <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full text-secondary-text bg-secondary-color-lt px-3 py-2 border border-border rounded-lg shadow-sm focus:outline-none"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1">
                  Office End Time (IST) <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                    onChange={handleChange}
                  className="w-full text-secondary-text bg-secondary-color-lt px-3 py-2 border border-border rounded-lg shadow-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            {timeError && <div className="text-red-600 mb-2">{timeError}</div>}
            {formError && <div className="text-red-600 mb-2">{formError}</div>}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                color="Blue"
                categories="Medium"
                onClick={onReset}
              >
                Reset
              </Button>
              <Button type="submit" color="Green" categories="Medium" >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default RoleCreation;
