import {Layout} from "@/components/Layouts/DefaultLayout";
import "@/styles/globals.css";

export default async function RootLayout({children,}:{children: React.ReactNode}){
    return (
    
    <Layout>
    {children}
    </Layout>
    );
    }