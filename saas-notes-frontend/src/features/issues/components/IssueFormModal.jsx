import React from "react";
import { Modal, Input, Form, Button, Select } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import UseApi from "../../../Hooks/UseApi";

const IssueFormModal = ({ visible, onClose, onSubmit, initialValues }) => {
    const isEditMode = !!initialValues?.id;
    const { data: projects, isPending: loadingProjects } = UseApi({ url: 'projects' });
    const { data: users, isPending: loadingUsers } = UseApi({ url: 'tenants/users' });

    const formik = useFormik({
        initialValues: {
            id: initialValues?.id || "",
            title: initialValues?.title || "",
            body: initialValues?.body || "",
            project_id: initialValues?.project_id || null, // Changed from category_id
            status: initialValues?.status || "TODO",
            priority: initialValues?.priority || "MEDIUM",
            type: initialValues?.type || "TASK",
            assigned_to: initialValues?.assigned_to || null,
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            body: Yup.string().required("Description is required"),
            project_id: Yup.number().nullable().required("Project is required"),
            status: Yup.string().required(),
            priority: Yup.string().required(),
            type: Yup.string().required(),
        }),
        onSubmit: (values, { resetForm }) => {
            // Map project_id back to camelCase or DB expectation if needed, but keeping it simple
            const payload = {
                ...values,
                category_id: values.project_id // Backend still expects category_id (aliased to project_id in DB rename but let's be safe or update backend)
            };
            // Actually, backend 'issues.js' expects 'category_id', but we renamed the column in DB.
            // Wait, note rename column 'category_id' -> 'project_id' in DB means `INSERT INTO notes (..., project_id)` works.
            // But `issues.js` currently does `INSERT INTO notes (..., category_id)`. 
            // I need to update issues.js too. For now let's send both or handle it.
            // Let's assume I will update issues.js next.

            onSubmit(values, isEditMode);
            onClose();
            resetForm();
        },
        enableReinitialize: true,
    });

    return (
        <Modal
            open={visible}
            title={isEditMode ? "Edit Issue" : "Create Issue"}
            onCancel={onClose}
            footer={null}
            destroyOnHidden
            width={600}
        >
            <Form layout="vertical" onFinish={formik.handleSubmit}>
                <Form.Item
                    label="Title"
                    validateStatus={formik.errors.title && formik.touched.title ? "error" : ""}
                    help={formik.touched.title && formik.errors.title}
                >
                    <Input
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter title"
                    />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Project" required>
                        <Select
                            value={formik.values.project_id}
                            placeholder="Select Project"
                            loading={loadingProjects}
                            onChange={(value) => formik.setFieldValue("project_id", value)}
                            options={(projects?.data || []).map((r) => ({
                                label: r.name,
                                value: r.project_id,
                            }))}
                        />
                        {formik.touched.project_id && formik.errors.project_id && (
                            <div className="text-red-500 text-xs">{formik.errors.project_id}</div>
                        )}
                    </Form.Item>
                    <Form.Item label="Type">
                        <Select
                            value={formik.values.type}
                            onChange={(val) => formik.setFieldValue("type", val)}
                            options={[
                                { label: "Task", value: "TASK" },
                                { label: "Bug", value: "BUG" },
                                { label: "Feature", value: "FEATURE" },
                            ]}
                        />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Status">
                        <Select
                            value={formik.values.status}
                            onChange={(val) => formik.setFieldValue("status", val)}
                            options={[
                                { label: "To Do", value: "TODO" },
                                { label: "In Progress", value: "IN_PROGRESS" },
                                { label: "Done", value: "DONE" },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Priority">
                        <Select
                            value={formik.values.priority}
                            onChange={(val) => formik.setFieldValue("priority", val)}
                            options={[
                                { label: "Low", value: "LOW" },
                                { label: "Medium", value: "MEDIUM" },
                                { label: "High", value: "HIGH" },
                                { label: "Critical", value: "CRITICAL" },
                            ]}
                        />
                    </Form.Item>
                </div>
                <Form.Item
                    label="Assignee"
                >
                    <Select
                        value={formik.values.assigned_to}
                        placeholder="Select Assignee"
                        loading={loadingUsers}
                        allowClear
                        onChange={(val) => formik.setFieldValue("assigned_to", val)}
                        options={(users || []).map(u => ({ label: u.user_name, value: u.id }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Description"
                    validateStatus={formik.errors.body && formik.touched.body ? "error" : ""}
                    help={formik.touched.body && formik.errors.body}
                >
                    <Input.TextArea
                        rows={4}
                        name="body"
                        value={formik.values.body}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Describe the issue..."
                    />
                </Form.Item>

                <div className="flex justify-end gap-2">
                    <Button onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit">
                        {isEditMode ? "Update" : "Create"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default IssueFormModal;
