import {
  MagnifyingGlass, ClipboardText, ShoppingCartSimple,
  Package, Stamp, Truck,
} from '@phosphor-icons/react/dist/ssr';

const steps = [
  { icon: MagnifyingGlass, label: 'Source', desc: 'Identify and verify suppliers' },
  { icon: ClipboardText, label: 'Inspect', desc: 'Quality control & verification' },
  { icon: ShoppingCartSimple, label: 'Procure', desc: 'Secure and consolidate goods' },
  { icon: Package, label: 'Ship', desc: 'Air, ocean, or rail freight' },
  { icon: Stamp, label: 'Clear Customs', desc: 'Documentation & compliance' },
  { icon: Truck, label: 'Deliver', desc: 'Last-mile to your door' },
];

export default function HowWeOperate() {
  return (
    <section className="section bg-paper">
      <div className="container-main">
        <div className="max-w-2xl mb-16 md:mb-20">
          <p className="eyebrow text-mist mb-4">How We Operate</p>
          <h2 className="heading-section mb-6">
            From Sourcing to Delivery,<br />Without Friction
          </h2>
          <div className="rule-gold" />
        </div>

        {/* Desktop horizontal timeline */}
        <div className="hidden md:block">
          <div className="grid grid-cols-6 gap-4 relative">
            <div className="absolute top-7 left-0 right-0 h-px bg-rule" style={{ marginLeft: '4%', marginRight: '4%' }} />
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="relative flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-white border border-rule flex items-center justify-center mb-5 relative z-10">
                    <Icon size={22} weight="light" className="text-gold" />
                  </div>
                  <p className="text-2xs tracking-widest text-mist uppercase mb-1">Step {idx + 1}</p>
                  <p className="font-display text-lg text-ink mb-1.5">{step.label}</p>
                  <p className="text-xs text-mist leading-relaxed px-2">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical timeline */}
        <div className="md:hidden space-y-0">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={step.label} className="flex gap-5 relative pb-10 last:pb-0">
                {idx !== steps.length - 1 && (
                  <div className="absolute left-7 top-14 bottom-0 w-px bg-rule" />
                )}
                <div className="w-14 h-14 rounded-full bg-white border border-rule flex items-center justify-center shrink-0 relative z-10">
                  <Icon size={22} weight="light" className="text-gold" />
                </div>
                <div className="pt-2">
                  <p className="text-2xs tracking-widest text-mist uppercase mb-1">Step {idx + 1}</p>
                  <p className="font-display text-lg text-ink mb-1">{step.label}</p>
                  <p className="text-xs text-mist leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
