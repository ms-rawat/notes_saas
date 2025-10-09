import React from "react";
import { Modal, Input, Form, Button, Select } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import UseApi from "../Hooks/UseApi";
import { isPending } from "@reduxjs/toolkit";

const NoteFormModal = ({ visible, onClose, onSubmit, initialValues }) => {
    const isEditMode = !!initialValues?.id;
    const { data: categories, isPending } = UseApi({ url: 'categories' })
    const formik = useFormik({
        initialValues: {
            title: initialValues?.title || "",
            body: initialValues?.body || "",
            category: initialValues?.category || "",
            owner_id: initialValues?.owner_id || "",
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            body: Yup.string().required("Body is required"),
            category: Yup.number().required("catagory is required"),

        }),
        onSubmit: (values, { resetForm }) => {
            onSubmit(values, isEditMode);
            resetForm();
        },
        enableReinitialize: true,
    });

    return (
        <Modal
            open={visible}
            title={isEditMode ? "Edit Note" : "Create Note"}
            onCancel={onClose}
            footer={null}
            destroyOnClose
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
                <Form.Item
                    label="Category"
                    validateStatus={formik.errors.category && formik.touched.category ? "error" : ""}
                    help={formik.touched.category && formik.errors.category}
                >
                    <Select
                        name="category"
                        value={formik.values.category}
                        placeholder="Enter category"
                        loading={isPending}
                        options={(categories?.data || []).map((r) => ({
                            label: r.name,
                            value: r.category_id,
                        }))}

                        onChange={(value) => formik.setFieldValue("category", value)}
                        onBlur={() => formik.setFieldTouched("category", true)}
                    />

                </Form.Item>
                <Form.Item
                    label="Body"
                    validateStatus={formik.errors.body && formik.touched.body ? "error" : ""}
                    help={formik.touched.body && formik.errors.body}
                >
                    <Input.TextArea
                        rows={4}
                        name="body"
                        value={formik.values.body}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Write your note..."
                    />
                </Form.Item>

                <div style={{ textAlign: "right" }}>
                    <Button onClick={onClose} style={{ marginRight: 8 }}>
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

export default NoteFormModal;
