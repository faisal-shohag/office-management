import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AddExams = () => {
  return (
    <div>
      <div style={{ overflow: "hidden" }}>
        <h1 className="text-2xl font-bold mb-3">Add Exam</h1>
        <form className="border p-5 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 mt-3 gap-4">
            <label htmlFor="Title" className="md:col-span-1" required>
              Name
              <Input type="text" id="name" placeholder="Name" />
            </label>
            <label htmlFor="Date" className="md:col-span-1">
              Date
              <Input type="date" id="date" required />
            </label>
          </div>
          <Button size="sm" className="h-8 gap-1 mt-5">
            Add Exam
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddExams;
