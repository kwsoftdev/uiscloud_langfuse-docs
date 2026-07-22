"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { FeaturedCustomers } from "./FeaturedCustomers";
import { BulletList } from "./BulletList";
import securityVisual from "./img/visuals/visual-security.svg";
import { isKoreanPath } from "@/lib/i18n/koPaths";

const architecture = [
  {
    label: "Clickhouse OLAP database",
    href: "/self-hosting/deployment/infrastructure/clickhouse",
  },
  {
    label: "Async ingestion via Redis queue",
    href: "/self-hosting/deployment/infrastructure/cache",
  },
  {
    label: "S3/Blob storage for large payloads",
    href: "/self-hosting/deployment/infrastructure/blobstorage",
  },
  {
    label: "Edge-cached prompts",
    href: "/docs/prompt-management/features/caching",
  },
];

const architectureKo = [
  {
    label: "ClickHouse OLAP 데이터베이스",
    href: "/self-hosting/deployment/infrastructure/clickhouse",
  },
  {
    label: "Redis 큐를 통한 비동기 수집",
    href: "/self-hosting/deployment/infrastructure/cache",
  },
  {
    label: "대용량 페이로드를 위한 S3/Blob Storage",
    href: "/self-hosting/deployment/infrastructure/blobstorage",
  },
  {
    label: "엣지에 캐싱되는 프롬프트",
    href: "/docs/prompt-management/features/caching",
  },
];

const openApis = [
  { label: "50M+ SDK installs/month", href: "/careers#public-metrics" },
  { label: "10+ billion observations processed per month" },
  { label: "2300+ customers" },
  { label: "99.9% uptime" },
];

const openApisKo = [
  { label: "월 5,000만+ SDK 설치", href: "/careers#public-metrics" },
  { label: "월 100억+ observation 처리" },
  { label: "2,300개+ 고객사" },
  { label: "99.9% 가동 시간" },
];

const security = [
  { label: "SOC 2 Type II", href: "/security/soc2" },
  { label: "ISO 27001", href: "/security/iso27001" },
  { label: "GDPR", href: "/security/gdpr" },
  { label: "EU & US Data Regions", href: "/security/data-regions" },
  { label: "HIPAA-ready region", href: "/security/hipaa" },
];

const securityKo = [
  { label: "SOC 2 Type II", href: "/security/soc2" },
  { label: "ISO 27001", href: "/security/iso27001" },
  { label: "GDPR", href: "/security/gdpr" },
  { label: "EU & US 데이터 리전", href: "/security/data-regions" },
  { label: "HIPAA 대응 리전", href: "/security/hipaa" },
];

export const Enterprise = () => {
  const ko = isKoreanPath(usePathname());
  return (
    <HomeSection id="scale-and-security" className="pt-[120px]">
      <div className="flex flex-col gap-4 items-start mb-10">
        <Heading>
          {ko ? (
            <>
              엔터프라이즈 <TextHighlight>확장성</TextHighlight> &{" "}
              <TextHighlight>보안</TextHighlight>.
            </>
          ) : (
            <>
              Enterprise{" "}
              <span className="min-[340px]:whitespace-nowrap">
                <TextHighlight>
                  scale
                  <span className="hidden min-[340px]:inline">&nbsp;</span>
                </TextHighlight>
                <span className="whitespace-nowrap">
                  <TextHighlight>and security</TextHighlight>.
                </span>
              </span>
            </>
          )}
        </Heading>
        <Text className="text-left max-w-[64ch]">
          {ko
            ? "전통적인 관측성 도구는 작은 스팬을 많이 처리하는 방식입니다. LLM 시스템은 다르게 동작합니다. 모든 단계가 풍부하고 방대한 I/O를 담고 있어 레거시 플랫폼은 규모가 커지면 감당하지 못합니다. Langfuse는 엄격한 컴플라이언스 프레임워크를 준수하면서도 엔터프라이즈 규모에서 안정적으로 LLM 트레이스를 수집하고 조회합니다."
            : "Traditional observability handles many small spans. LLM systems run differently. Every step carries rich, verbose I/O that legacy platforms can't handle at scale. Langfuse ingests and queries LLM traces reliably at enterprise scale while following strict compliance frameworks."}
        </Text>
      </div>

      <div className="flex flex-col-reverse items-stretch sm:grid sm:grid-cols-2">
        <div className="flex flex-col flex-1">
          <CornerBox
            hoverStripes
            className="flex flex-col flex-1 gap-3 p-3 -mt-px sm:p-4"
          >
            <Text
              size="m"
              className="font-medium text-left text-text-secondary"
            >
              {ko ? "아키텍처" : "Architecture"}
            </Text>
            <BulletList items={ko ? architectureKo : architecture} />
          </CornerBox>
          <CornerBox
            hoverStripes
            className="flex flex-col flex-1 gap-3 p-3 -mt-px sm:p-4"
          >
            <Text
              size="m"
              className="font-medium text-left text-text-secondary"
            >
              {ko ? "규모에서의 안정성" : "Reliability at scale"}
            </Text>
            <BulletList items={ko ? openApisKo : openApis} />
          </CornerBox>
        </div>

        <CornerBox
          hoverStripes
          className="flex relative flex-col -mt-px md:-ml-px min-h-[350px]"
        >
          <div className="flex flex-col gap-3 p-4">
            <Text
              size="m"
              className="font-medium text-left text-text-secondary"
            >
              {ko ? "보안 & 컴플라이언스" : "Security & compliance"}
            </Text>
            <BulletList items={ko ? securityKo : security} />
          </div>
          <div className="flex absolute bottom-0 flex-1 justify-center items-center pointer-events-none">
            <Image
              src={securityVisual}
              alt={ko ? "보안" : "Security"}
              width={100}
              height={100}
              className="object-contain w-full h-full"
            />
          </div>
        </CornerBox>
      </div>

      <FeaturedCustomers />
    </HomeSection>
  );
};
