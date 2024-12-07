import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TextField from "@mui/material/TextField";
export const metadata: Metadata = {
  title: "Next.js Settings | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Settings page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

function node_card(product_name: any): any {
  return (
    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
      <div className="mb-4 flex items-center gap-3">
        <div>
          <span className="mb-1.5 text-black dark:text-white">
            {product_name}
          </span>

          <span className="flex gap-2.5">
            <button className="text-sm hover:text-primary">Delete</button>
            <button className="text-sm hover:text-primary">Update</button>
          </span>
        </div>
      </div>
      <span className="mb-1.5 text-black dark:text-white">
        <TextField
          label="carbon emission intensity"
          defaultValue={12}
          name="numberformat"
          id="formatted-numberformat-input"
          slotProps={{
            input: {
              // inputComponent: NumericFormatCustom as any,
            },
          }}
          variant="standard"
        />
      </span>
    </div>
  );
}

function schema_card(product_name: any): any {
  function handleChange(value:any):any{
    console.log("heyy",value)
  }
  return (
    <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
      <div className="mb-4 flex items-center gap-3">
        <div>
          <span className="mb-1.5 text-black dark:text-white">
            {product_name}
          </span>
          <span className="flex gap-2.5">
            <button className="text-sm hover:text-primary">Delete</button>
            <button className="text-sm hover:text-primary">Update</button>
          </span>
        </div>
      </div>
      <span className="flex mb-1.5 text-black dark:text-white">
        <TextField
          label="carbon emission intensity"
          defaultValue={12}
          name="numberformat"
          id="formatted-numberformat-input"
          slotProps={{
            input: {
              // inputComponent: NumericFormatCustom as any,
            },
          }}
          variant="standard"
        />
      </span>
    </div>
  );
}

const Settings = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Manage Schema
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  {schema_card("Big Mac")}
                  {schema_card("Chicken Nuggets")}

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Manage Nodes
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  {node_card("Patty")}
                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                      type="submit"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Settings;
