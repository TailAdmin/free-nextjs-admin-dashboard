import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import SelectDtsTemplate from "@/components/Templates/SelectDtsTemplate";

const Templates = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Templates" />

      <div className="flex flex-col gap-10">
        <SelectDtsTemplate />
      </div>
    </DefaultLayout>
  );
};

export default Templates;
