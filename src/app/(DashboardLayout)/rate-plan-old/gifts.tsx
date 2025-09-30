const OptimizationBadge: React.FC = () => {
  return (
    <span
      className="self-center px-3.5 pt-1 pb-px m-auto text-xs font-semibold leading-3 text-center text-blue-500 whitespace-nowrap
    border border-[#4776EF] bg-[background: #4776EF1A] bg-opacity-20 rounded-full"
    >
      최적화
    </span>
  );
};

type PricingFeatureProps = {
  children: React.ReactNode;
  showBadge?: boolean;
};
export const GiftFeature: React.FC<PricingFeatureProps> = ({ children, showBadge }) => {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/images/gift.png" alt="" />
      <div className="my-auto text-base leading-[25.17px] basis-auto text-[#6A6A6A] flex items-center gap-0">
        {children}
      </div>
      {showBadge && <OptimizationBadge />}
    </div>
  );
};
