import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { PaperClipIcon, SendIcon } from "@/icons";

export default function InputGroupTextareaExample() {
  return (
    <Field>
      <FieldLabel>Message with Actions</FieldLabel>
      <InputGroup className="overflow-hidden">
        <InputGroupTextarea
          placeholder="Write your message or comment..."
          rows={4}
        />
        <InputGroupAddon
          align="block-end"
          className="flex w-full items-center justify-between border-t border-gray-200 px-3.5 py-2.5 dark:border-gray-800"
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Attach file"
            >
              <PaperClipIcon className="size-4" />
            </button>
            <InputGroupText className="text-xs text-gray-400">
              Markdown supported
            </InputGroupText>
          </div>
          <InputGroupButton size="xs" variant="default">
            <SendIcon className="size-3.5" />
            <span>Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}
