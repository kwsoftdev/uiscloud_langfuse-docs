"use client";

import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Text } from "@/components/ui/text";
import { Dot } from "@/components/ui/dot";
import { isKoreanPath } from "@/lib/i18n/koPaths";

/** Slower than Integrations marquee rows (40–48s) for short hero copy */
const MARQUEE_DURATION_SEC = 40;

function StatItems({ ko }: { ko: boolean }) {
  if (ko) {
    return (
      <>
        <Text size="s" className="whitespace-nowrap shrink-0">
          <b className="text-primary">포춘 50대 기업 19곳</b>이 사용 중
        </Text>
        <Dot />
        <Text size="s" className="whitespace-nowrap shrink-0">
          월 <b className="text-primary">100억+</b> 건의 observation 처리
        </Text>
        <Dot />
        <Text size="s" className="whitespace-nowrap shrink-0">
          <b className="text-primary">100,000+</b>명의 엔지니어가 Langfuse로
          구축 중
        </Text>
      </>
    );
  }
  return (
    <>
      <Text size="s" className="whitespace-nowrap shrink-0">
        Used by <b className="text-primary">19</b> of Fortune 50
      </Text>
      <Dot />
      <Text size="s" className="whitespace-nowrap shrink-0">
        <b className="text-primary">10+ billion</b> observations/month
      </Text>
      <Dot />
      <Text size="s" className="whitespace-nowrap shrink-0">
        <b className="text-primary">100,000+</b> engineers building on Langfuse
      </Text>
    </>
  );
}

export function HeroStatsStrip() {
  const ko = isKoreanPath(usePathname());
  return (
    <>
      <div className="xl:hidden overflow-hidden w-full mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <motion.div
          className="flex gap-3 lg:gap-6 items-center w-max py-[10px]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: MARQUEE_DURATION_SEC,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[0, 1].map((i) => (
            <Fragment key={i}>
              <StatItems ko={ko} />
              <Dot />
            </Fragment>
          ))}
        </motion.div>
      </div>
      <div className="hidden xl:block overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 lg:gap-6 justify-center items-center px-4 py-[10px] min-w-max mx-auto">
          <StatItems ko={ko} />
        </div>
      </div>
    </>
  );
}
