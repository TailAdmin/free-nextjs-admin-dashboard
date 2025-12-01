import Link from "next/link";

export default function Home() {

    return <div>
        Welcome to the Next.js Dashboard
        <div>
            <Link href="/dashboard" className="text-blue-500 underline">Go to Dashboard</Link>
        </div>
    </div>;
}