"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Phase = "visible" | "lifting" | "done";

export default function LoadingCurtain() {
  const [phase, setPhase] = useState<Phase>("visible");

  useEffect(() => {
    if (sessionStorage.getItem("curtain_shown")) {
      setPhase("done");
      return;
    }
    sessionStorage.setItem("curtain_shown", "1");

    // Hold for 2s, then lift (0.9s), remove at 3s
    const t1 = setTimeout(() => setPhase("lifting"), 2000);
    const t2 = setTimeout(() => setPhase("done"),    2950);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (phase === "done") return null;

  return (
    <div className={`curtain${phase === "lifting" ? " curtain--lift" : ""}`}>
      <div className="curtain__logo">
        <Image
          src="/logo/logo-black.png"
          alt="Toolegend"
          width={160}
          height={52}
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
