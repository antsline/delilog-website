import Image from "next/image";

type Props = {
  src: string;
  className?: string;
};

// PC で読んでいる人向け。スマホでは出さない（その端末でそのままストアを開ける）。
export function DesktopQr({ src, className = "" }: Props) {
  return (
    <div className={`hidden lg:flex flex-col items-center flex-shrink-0 gap-1.5 ${className}`}>
      <Image src={src} alt="delilog のダウンロード用QRコード" width={96} height={96} className="rounded-md" unoptimized />
      <span className="text-[11px] leading-tight text-slate-500 text-center">
        スマホで読み取って
        <br />
        インストール
      </span>
    </div>
  );
}
