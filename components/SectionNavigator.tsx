"use client";

import { useSectionSnap } from "@/hooks/useSectionSnap";

export default function SectionNavigator() {
  useSectionSnap({
    enabled: true,
    touchThreshold: 30,
    wheelThreshold: 15,
    animationDuration: 0.7,
    cooldown: 750,
  });

  return null;
}
