import React, { useEffect } from "react";
import { Modal, Input, Form, Button, Select } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import UseApi from "../../../Hooks/UseApi";

const ProjectFormModal = ({ visible, onClose, onSubmit, initialValues }) => {
    const isEditMode = !!initialValues?.project_id;
    const { data: users, isPending: loadingUsers } = UseApi({ url: 'tenants/users' });

    const formik = useFormik({
        initialValues: {
            project_id: initialValues?.project_id || "",
            name: initialValues?.name || "",
            project_key: initialValues?.project_key || "",
            description: initialValues?.description || "",
            manager_id: initialValues?.manager_id || null,
            status: initialValues?.status || "ACTIVE",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            project_key: Yup.string().required("Key is required").max(10, "Max 10 chars"),
            manager_id: Yup.number().nullable(),
        }),
        onSubmit: (values, { resetForm }) => {
            onSubmit(values, isEditMode);
            onClose();
            resetForm();
        },
        enableReinitialize: true,
    });

    // Auto-generate key from name if creating
    useEffect(() => {
        if (!isEditMode && formik.values.name && !formik.touched.project_key) {
            const generated = formik.values.name.substring(0, 3).toUpperCase();
            formik.setFieldValue("project_key", generated);
        }
    }, [formik.values.name]);

    return (
        <Modal
            open={visible}
            title={isEditMode ? "Edit Project" : "Create Project"}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
        >
            <Form layout="vertical" onFinish={formik.submitForm}>
                <Form.Item
                    label="Project Name"
                    validateStatus={formik.errors.name && formik.touched.name ? "error" : ""}
                    help={formik.touched.name && formik.errors.name}
                >
                    <Input
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="e.g. Website Redesign"
                    />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        label="Project Key"
                        validateStatus={formik.errors.project_key && formik.touched.project_key ? "error" : ""}
                        help={formik.touched.project_key && formik.errors.project_key}
                    >
                        <Input
                            name="project_key"
                            value={formik.values.project_key}
                            onChange={(e) => {
                                formik.setFieldValue("project_key", e.target.value.toUpperCase());
                            }}
                            onBlur={formik.handleBlur}
                            placeholder="e.g. WEB"
                            maxLength={10}
                        />
                    </Form.Item>
                    <Form.Item label="Status">
                        <Select
                            value={formik.values.status}
                            onChange={(val) => formik.setFieldValue("status", val)}
                            options={[
                                { label: "Active", value: "ACTIVE" },
                                { label: "Archived", value: "ARCHIVED" },
                            ]}
                        />
                    </Form.Item>
                </div>

                <Form.Item label="Project Manager">
                    <Select
                        value={formik.values.manager_id}
                        placeholder="Select Manager"
                        loading={loadingUsers}
                        allowClear
                        onChange={(val) => formik.setFieldValue("manager_id", val)}
                        options={(users || []).map(u => ({ label: u.user_name, value: u.id }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                >
                    <Input.TextArea
                        rows={3}
                        name="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Project goals..."
                    />
                </Form.Item>

                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={formik.isSubmitting}>
                        {isEditMode ? "Update" : "Create"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ProjectFormModal;
