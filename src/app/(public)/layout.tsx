import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default async function Layout({children,}:{children: React.ReactNode}){
    return (
    
    <DefaultLayout variant="public">
    {children}
    </DefaultLayout>
    );
    }