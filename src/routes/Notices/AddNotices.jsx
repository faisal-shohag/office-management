import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddNotices = () => {
  return (
    <div style={{ overflow: "hidden" }}>
      <h1 className="text-2xl font-bold mb-3">Add Notice</h1>
      <form className="border p-5 rounded">
        <div className="grid grid-cols-1 md:grid-cols-3 mt-3 gap-4">
          <label htmlFor="Title" className="md:col-span-1">
            Title
            <Input type="text" id="title" placeholder="Title" />
          </label>
          <label htmlFor="File" className="md:col-span-1">
            Upload File
            <Input type="file" id="file" placeholder="File" />
          </label>
        </div>
        <Button size="sm" className="h-8 gap-1 mt-5">
          Add Notice
        </Button>
      </form>
    </div>
  );
};

export default AddNotices;
