import Link from "next/link";

export default function KrSecurityNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <p className="text-fd-muted-foreground">
        찾으시는 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link href="/security/kr" className="text-fd-primary hover:underline">
        보안 홈으로
      </Link>
    </div>
  );
}
