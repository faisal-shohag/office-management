import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AddResults = () => {
    return (
        <div style={{ overflow: "hidden" }}>
        <h1 className="text-2xl font-bold mb-3">Add Result</h1>
        <form className="border p-5 rounded">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <label htmlFor="Upload Result" className="md:col-span-1">
              Upload Result
              <Input type="file" id="name" placeholder="Upload Result"required/>
            </label>
            
          </div>
          <Button size="sm" className="h-8 gap-1 mt-5">
          Add Result
        </Button>
        </form>
      </div> 
    );
};

export default AddResults;