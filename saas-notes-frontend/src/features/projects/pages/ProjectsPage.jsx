import { useState, useEffect } from "react";
import { Button, message, Card, Tag, Avatar, Tooltip, Popconfirm } from "antd";
import { Plus, FolderOpen, User } from "lucide-react";
import UseApi from "../../../Hooks/UseApi";
import ProjectFormModal from "../components/ProjectFormModal";
import usePageTitle from "../../../Hooks/usePageTitle";
import { useNavigate } from "react-router";

const { Meta } = Card;

const ProjectsPage = () => {
    usePageTitle("Projects");
    const navigate = useNavigate();

    // API Hooks
    const { data: projectsData, refetch, isPending: loading } = UseApi({
        url: "projects",
        method: "GET",
    });

    const { mutate: createProject } = UseApi({ url: "projects", method: "post", queryKey: ["projects"] });
    const { mutate: updateProject } = UseApi({ url: "projects", method: "PUT", queryKey: ["projects"] });
    const { mutate: deleteProject } = UseApi({ url: "projects", method: "DELETE", queryKey: ["projects"] });

    // State
    const [visible, setVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Handlers
    const handleSubmit = (values, isEditMode) => {
        const handler = isEditMode ? updateProject : createProject;
        handler(values, {
            onSuccess: () => {
                message.success(`Project ${isEditMode ? 'updated' : 'created'}`);
                refetch();
            },
            onError: (err) => message.error(err.message)
        });
    };

    const handleDelete = (id) => {
        deleteProject({ project_id: id }, {
            onSuccess: () => {
                message.success("Project deleted");
                refetch();
            },
            onError: (err) => message.error(err.message || "Failed to delete project")
        });
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-textsecondary">Projects</h1>
                    <p className="text-textsurface text-sm">Manage your software projects.</p>
                </div>
                <Button type="primary" icon={<Plus size={16} />} onClick={() => { setSelectedProject(null); setVisible(true); }}>
                    Create Project
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(projectsData?.data || []).map(project => (
                    <Card
                        key={project.project_id}
                        hoverable
                        className="glass-card border-none"
                        actions={[
                            <span onClick={() => { setSelectedProject(project); setVisible(true); }}>Edit</span>,
                            <Popconfirm title="Delete project?" onConfirm={() => handleDelete(project.project_id)}>
                                <span className="text-red-500">Delete</span>
                            </Popconfirm>
                        ]}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <Avatar shape="square" icon={<FolderOpen size={18} />} className="bg-accent/20 text-accent" />
                                <div>
                                    <h3 className="font-semibold text-lg leading-none text-textprimary">{project.name}</h3>
                                    <span className="text-xs text-textsecondary font-mono">{project.project_key}</span>
                                </div>
                            </div>
                            <Tag className="border-border bg-accent/10 text-textprimary">{project.status}</Tag>
                        </div>

                        <p className="text-textsecondary text-sm line-clamp-2 min-h-[40px] mb-4">
                            {project.description || "No description provided."}
                        </p>

                        <div className="flex justify-between items-center bg-bg/50 p-2 rounded-lg border border-border">
                            <span className="text-xs text-textsecondary">Manager</span>
                            {project.manager_name ? (
                                <Tooltip title={project.manager_name}>
                                    <div className="flex items-center gap-1">
                                        <Avatar size="small" className="bg-primary text-white">{project.manager_name[0]}</Avatar>
                                        <span className="text-sm font-medium text-textprimary">{project.manager_name}</span>
                                    </div>
                                </Tooltip>
                            ) : <span className="text-xs italic text-muted">Unassigned</span>}
                        </div>
                    </Card>
                ))}
            </div>

            <ProjectFormModal
                visible={visible}
                onClose={() => { setVisible(false); setSelectedProject(null); }}
                onSubmit={handleSubmit}
                initialValues={selectedProject}
            />
        </div>
    );
};

export default ProjectsPage;
