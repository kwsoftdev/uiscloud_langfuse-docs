"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, Heading, TextHighlight } from "@/components/ui";
import { IntegrationLabel } from "@/components/ui/integration-label";
import { Text } from "@/components/ui/text";
import { BulletList } from "./BulletList";
import { isKoreanPath } from "@/lib/i18n/koPaths";

const cards = [
  {
    title: "Self-host at scale",
    titleKo: "규모에 맞춰 셀프 호스팅",
    labels: [
      {
        label: "Docker Compose",
        href: "/self-hosting/deployment/docker-compose",
        icon: (
          <Image
            src="/images/integrations/docker.svg"
            alt=""
            width={18}
            height={18}
          />
        ),
      },
      {
        label: "Kubernetes (Helm)",
        href: "/self-hosting/deployment/kubernetes-helm",
        icon: (
          <Image
            src="/images/integrations/kubernetes.svg"
            alt=""
            width={18}
            height={18}
          />
        ),
      },
      {
        label: "AWS (Terraform)",
        href: "/self-hosting/deployment/aws",
        icon: (
          <Image
            src="/images/integrations/aws.svg"
            alt=""
            width={18}
            height={18}
          />
        ),
      },
      {
        label: "GCP (Terraform)",
        href: "/self-hosting/deployment/gcp",
        icon: (
          <Image
            src="/images/integrations/gcp.svg"
            alt=""
            width={18}
            height={18}
          />
        ),
      },
      {
        label: "Azure (Terraform)",
        href: "/self-hosting/deployment/azure",
        icon: (
          <Image
            src="/images/integrations/microsoft_icon.svg"
            alt=""
            width={18}
            height={18}
          />
        ),
      },
    ],
  },
  {
    title: "MIT license",
    titleKo: "MIT 라이선스",
    bullets: [
      { label: "All product features MIT licensed", href: "/self-hosting" },
      {
        label: "Scales to billions of monthly events",
        href: "/self-hosting/configuration/scaling",
      },
      {
        label: "Fork, modify, contribute",
        href: "https://github.com/langfuse/langfuse",
      },
    ],
    bulletsKo: [
      { label: "모든 제품 기능이 MIT 라이선스", href: "/self-hosting" },
      {
        label: "월 수십억 건의 이벤트까지 확장",
        href: "/self-hosting/configuration/scaling",
      },
      {
        label: "Fork, 수정, 기여 자유",
        href: "https://github.com/langfuse/langfuse",
      },
    ],
  },
  {
    title: "APIs & exports",
    titleKo: "API & 내보내기",
    bullets: [
      {
        label: "REST APIs for everything",
        href: "/docs/api-and-data-platform/features/public-api",
      },
      {
        label: "Query SDK",
        href: "/docs/api-and-data-platform/features/query-via-sdk",
      },
      {
        label: "S3 blob storage export",
        href: "/docs/api-and-data-platform/features/export-to-blob-storage",
      },
    ],
    bulletsKo: [
      {
        label: "모든 기능에 대한 REST API",
        href: "/docs/api-and-data-platform/features/public-api",
      },
      {
        label: "Query SDK",
        href: "/docs/api-and-data-platform/features/query-via-sdk",
      },
      {
        label: "S3 Blob Storage 내보내기",
        href: "/docs/api-and-data-platform/features/export-to-blob-storage",
      },
    ],
  },
  {
    title: "Active OSS community",
    titleKo: "활발한 오픈소스 커뮤니티",
    bullets: [
      {
        label: "22,000+ GitHub stars",
        href: "https://github.com/langfuse/langfuse",
      },
      { label: "5,000+ Discord members", href: "https://langfuse.com/discord" },
      { label: "Weekly releases and community hours", href: "/changelog" },
    ],
    bulletsKo: [
      {
        label: "GitHub 스타 22,000개 이상",
        href: "https://github.com/langfuse/langfuse",
      },
      {
        label: "Discord 멤버 5,000명 이상",
        href: "https://langfuse.com/discord",
      },
      { label: "매주 릴리스 및 커뮤니티 아워", href: "/changelog" },
    ],
  },
];

export const OpenSource = () => {
  const ko = isKoreanPath(usePathname());
  return (
    <HomeSection id="open-source" className="pt-[120px]">
      <div className="flex flex-col gap-4 items-start mb-10">
        <Heading className="text-left max-w-[12ch] sm:max-w-none">
          {ko ? (
            <>
              <TextHighlight>오픈 플랫폼.</TextHighlight> 오픈 소스.
            </>
          ) : (
            <>
              <TextHighlight>Open platform.</TextHighlight> Open source.
            </>
          )}
        </Heading>
        <Text className="text-left max-w-[48ch]">
          {ko
            ? "저희는 오픈 표준과 데이터 이동성의 열렬한 지지자입니다. Langfuse는 어떤 경우에도 여러분의 데이터를 가두지 않습니다."
            : "We are huge fans of open standards and data portability. Langfuse won't lock in your data, ever."}
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {cards.map((card) => {
          const bullets = ko ? (card.bulletsKo ?? card.bullets) : card.bullets;
          return (
            <CornerBox
              key={card.title}
              hoverStripes
              className="flex flex-col gap-1 p-3 -mt-px -ml-px sm:p-4"
            >
              <Text className="font-medium text-left text-text-secondary">
                {ko ? (card.titleKo ?? card.title) : card.title}
              </Text>
              {card.labels ? (
                <div className="flex flex-col flex-wrap gap-2 justify-start items-start mt-1 md:grid md:grid-cols-2">
                  {card.labels.map((item) => (
                    <IntegrationLabel
                      key={item.label}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      className="justify-start"
                    />
                  ))}
                </div>
              ) : (
                <BulletList items={bullets ?? []} />
              )}
            </CornerBox>
          );
        })}
      </div>
    </HomeSection>
  );
};
