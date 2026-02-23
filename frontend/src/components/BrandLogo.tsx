import Image from "next/image";

type BrandLogoProps = {
  compact?: boolean;
};

export default function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <div className={`brand-logo ${compact ? "is-compact" : ""}`}>
      <Image
        src="/portal-logo.svg"
        alt="AptiCore logo"
        width={compact ? 28 : 34}
        height={compact ? 28 : 34}
        priority
      />
      <div className="brand-logo-text">
        <strong>AptiCore</strong>
        <span>Recruitment Intelligence</span>
      </div>
    </div>
  );
}
