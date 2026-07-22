import { CornerBox } from "@/components/ui/corner-box";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const linkClassName =
  "text-text-tertiary transition-colors hover:text-text-primary";
const footerTextClassName = "text-[13px] leading-[150%] lg:leading-[150%]";
const footerMonoTextClassName = cn(footerTextClassName, "font-mono");
const footerMutedTextClassName = cn(
  footerMonoTextClassName,
  "text-left text-text-disabled",
);

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "px-4 pb-8 mx-auto mt-20 w-full sm:px-8 md:px-0 md:max-w-[680px] xl:max-w-[840px]",
        className,
      )}
    >
      <CornerBox className="flex flex-col gap-y-4 sm:flex-row justify-between sm:items-center px-4 py-2.5 bg-transparent">
        <div className="flex flex-col md:flex-row">
          <Text size="s" className={footerMutedTextClassName}>
            &copy; 2022&ndash;{new Date().getFullYear()} Langfuse GmbH
          </Text>{" "}
          <Text size="s" className={footerMutedTextClassName}>
            / Finto Technologies Inc.
          </Text>
        </div>
        <Text size="s" className={footerMutedTextClassName}>
          Design by{" "}
          <Link
            href="https://altalogy.com/?ref=langfuse"
            target="_blank"
            rel="nofollow noreferrer"
            className={linkClassName}
          >
            <span>Altalogy</span>
          </Link>
        </Text>
      </CornerBox>
    </footer>
  );
}
