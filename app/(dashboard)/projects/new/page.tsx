import CreateProjectForm from "@/components/projects/create-project-form";

const NewProjectPage = async () => {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">
          Dashboard / Projects / New
        </p>

        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Create project
        </h1>

        <p className="mt-2 text-muted-foreground">
          Add a website review project and install the PageLoop widget.
        </p>
      </div>

      <div className="rounded-xl border bg-background p-5">
        <CreateProjectForm />
      </div>
    </div>
  );
};

export default NewProjectPage;