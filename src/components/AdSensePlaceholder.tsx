import { ReactNode } from 'react';

type AdSlotType = 'top-banner' | 'in-content' | 'bottom-ad' | 'side-banner';

interface AdSensePlaceholderProps {
  type: AdSlotType;
  children?: ReactNode;
  id?: string;
}

export default function AdSensePlaceholder({ type, children, id = 'adsense-slot' }: AdSensePlaceholderProps) {
  // Define structural dimensions based on AdSense standards
  // without sacrificing beautiful layouts
  const stylesMap: Record<AdSlotType, { containerClass: string; label: string }> = {
    'top-banner': {
      containerClass: 'w-full min-h-[90px] md:min-h-[100px] py-2 md:py-4',
      label: 'Leaderboard Ad Zone (e.g. 728x90 or Adaptive Banner)',
    },
    'in-content': {
      containerClass: 'w-full min-h-[120px] md:min-h-[250px] py-4',
      label: 'In-Content Ad Slot (e.g. 336x280 or Responsive Rectangle)',
    },
    'bottom-ad': {
      containerClass: 'w-full min-h-[90px] md:min-h-[250px] py-4 md:py-8 border-t border-gray-100 mt-8',
      label: 'Bottom Anchor Ad Slot (e.g. 728x90 or Large Display)',
    },
    'side-banner': {
      containerClass: 'w-full min-h-[120px] md:min-h-[200px] py-2',
      label: 'Sidebar Ad Slot (e.g. 160x600 or 300x250 Banner)',
    },
  };

  const { containerClass, label } = stylesMap[type];

  return (
    <div
      id={`${id}-${type}`}
      className={`mx-auto max-w-7xl px-4 flex flex-col items-center justify-center ${containerClass}`}
    >
      <div className="w-full flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 rounded-xl border border-dashed border-gray-200 p-4 transition-colors duration-200">
        <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase mb-2">
          Sponsored Link
        </span>
        {children ? (
          <div className="w-full flex justify-center">{children}</div>
        ) : (
          <div className="text-xs text-gray-400 text-center font-sans italic">
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
