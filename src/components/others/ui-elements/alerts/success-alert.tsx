import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "@/i18n/navigation";
import { CheckCircleIcon } from "@/icons";

export default function SuccessAlert() {
  return (
    <div className="space-y-4">
      <Alert variant="success" className="p-4">
        <CheckCircleIcon className="size-5" />
        <AlertTitle>Success Message</AlertTitle>
        <AlertDescription>
          <p>Be cautious when performing this action.</p>
          <Link
            href="/"
            className="mt-3 inline-block text-sm font-medium text-gray-500 underline dark:text-gray-400"
          >
            Learn more
          </Link>
        </AlertDescription>
      </Alert>

      <Alert variant="success" className="p-4">
        <CheckCircleIcon className="size-5" />
        <AlertTitle>Success Message</AlertTitle>
        <AlertDescription>
          Be cautious when performing this action.
        </AlertDescription>
      </Alert>
    </div>
  );
}
