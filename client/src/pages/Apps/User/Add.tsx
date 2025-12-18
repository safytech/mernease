import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Save, XCircle, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { useApi } from "@/api";
import { coloredToast } from "@/hooks/useToast";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/Button";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { cardTitle } from "@/styles/twClasses";
import useBackToList from "@/hooks/useBackToList";

interface FormData {
  _id?: string;
  fullname: string;
  email: string;
  phone: string;
  password?: string;
  isActive: boolean;
}

const Add = () => {
  const navigate = useNavigate();
  const { goBackToList } = useBackToList("/users");
  const api = useApi();
  const { id } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      _id: "",
      fullname: "",
      email: "",
      phone: "",
      password: "",
      isActive: true,
    },
  });

  const watchedIsActive = watch("isActive");

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (id) {
          const userRes = await api.get(`/user/getUser/${id}`);
          const user = userRes.data?.user || userRes.data;

          if (user) {
            setValue("fullname", user.fullname || "");
            setValue("email", user.email || "");
            setValue("phone", user.phone || "");
            setValue("isActive", user.isActive ?? true);
          }
        }
      } catch (err) {
        console.error("Error loading user:", err);
        coloredToast("error", "Failed to load user details");
      }
    };

    loadUser();
  }, [id, api, setValue]);

  const onSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);

      if (id && (!formData.password || formData.password.trim() === "")) {
        delete formData.password;
      }

      const res = id
        ? await api.put(`/user/update/${id}`, formData)
        : await api.post("/user/adduser", formData);

      if (res.data.success) {
        coloredToast("success", `Record ${id ? "updated" : "added"} successfully`);
        if (id) {
          goBackToList();
        } else {
          navigate("/users");
        }
      } else {
        coloredToast("error", res.data?.message || "Something went wrong");
      }
    } catch (err: any) {
      coloredToast("error", err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb
        pageTitle="User Management"
        breadcrumbLinks={[
          { label: "Home", path: "/" },
          { label: "User Management", path: "/users" },
          { label: id ? "Edit User" : "Add User" },
        ]}
      />

      <div className="space-y-6 relative">
        <ComponentCard>
          <div className="mb-6 flex items-center justify-between">
            <h4 className={cardTitle}>{id ? "Edit User" : "Add User"}</h4>
            <button
              onClick={goBackToList}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label>
                  Full Name <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="fullname"
                  placeholder="Enter full name"
                  error={!!errors.fullname}
                  hint={errors.fullname?.message}
                  {...register("fullname", { required: "Full name is required" })}
                />
              </div>

              <div>
                <Label>
                  Email <span className="text-red-600">*</span>
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  autoComplete="off"
                  error={!!errors.email}
                  hint={errors.email?.message}
                  {...register("email", { required: "Email is required" })}
                />
              </div>

              <div>
                <Label>
                  Phone <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  error={!!errors.phone}
                  hint={errors.phone?.message}
                  {...register("phone", { required: "Phone is required" })}
                />
              </div>


                <div>
                  <Label>
                    {id ? "Change Password (optional)" : <>
                      Password <span className="text-red-600">*</span>
                    </>}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder={id ? "Enter password to change" : "Enter password"}
                      autoComplete="new-password"
                      error={!!errors.password}
                      hint={errors.password?.message}
                      {...register("password", { required: !id ? "Password is required" : false })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {id && <p className="text-xs mt-1 text-gray-500">Leave blank to keep current password</p>}
                </div>

                <div>
                  <Label className="mb-2">Status</Label>
                  <div className="flex items-center gap-4">
                    <ToggleSwitch
                      checked={watchedIsActive}
                      onChange={() => setValue("isActive", !watchedIsActive)}
                    />
                    <span className="text-gray-700">
                      {watchedIsActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
            </div>

            <div className="flex justify-end items-center gap-3 pt-6">
              <Button type="button" variant="secondary" onClick={goBackToList}>
                <XCircle className="w-4 h-4" /> Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="w-4 h-4" /> {isSubmitting ? "Saving..." : id ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
};

export default Add;
