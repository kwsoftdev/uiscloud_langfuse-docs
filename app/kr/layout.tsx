import { HomeLayout } from "@/components/layout";

export default function KrHomeLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HomeLayout lang="ko">{children}</HomeLayout>;
}
