"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

const Logo = ({ className }: { className?: string }) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  {/* <>
    <Image
      className={className + " hidden dark:block"}
      width={296}
      height={77}
      src="/makr-logo-light.svg"
      alt="makr-logo"
    />
    <Image
      className={className + " dark:hidden"}
      width={296}
      height={77}
      src="/makr-logo-dark.svg"
      alt="makr-logo"
    />
  </> */}

  if (!mounted) return null;
  return (
    <h1 className="text-2xl font-bold text-center text-neutral-900 dark:text-neutral-50">
      GPT PRIME
    </h1>
  );
};

export default Logo;
