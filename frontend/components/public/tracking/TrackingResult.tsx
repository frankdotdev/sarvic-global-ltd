import {
  Package, MapPin, CalendarBlank, Airplane, Anchor, Train, Truck,
  FileText, Download, CheckCircle, Circle,
} from '@phosphor-icons/react/dist/ssr';
import { format } from 'date-fns';
import {
  PublicTrackingResult, STATUS_LABELS, MODE_LABELS,
  STATUS_PROGRESS_ORDER, STATUS_BADGE_CLASS,
} from '@/types';

const modeIcons = { air: Airplane, ocean: Anchor, rail: Train, road: Truck, multimodal: Package };

export default function TrackingResult({ result }: { result: PublicTrackingResult }) {
  const ModeIcon = modeIcons[result.transport_mode] || Package;
  const isCancelled = result.status === 'cancelled';
  const isOnHold = result.status === 'on_hold';
  const currentStepIndex = STATUS_PROGRESS_ORDER.indexOf(
    result.status === 'out_for_delivery' ? 'ready_for_pickup' : result.status
  );

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      
      {/* Status Card */}
      <div className="bg-white border border-rule p-6 md:p-10 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <p className="text-2xs tracking-widest text-mist uppercase mb-2">Tracking Number</p>
            <p className="font-mono text-2xl md:text-3xl text-ink tracking-wider">{result.tracking_number}</p>
          </div>
          <span className={`badge ${STATUS_BADGE_CLASS[result.status]}`}>
            {STATUS_LABELS[result.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-rule">
          <InfoBlock icon={<ModeIcon size={16} weight="light" />} label="Transport Mode" value={MODE_LABELS[result.transport_mode]} />
          <InfoBlock icon={<MapPin size={16} weight="light" />} label="Current Location" value={result.current_location || 'Updating soon'} />
          <InfoBlock icon={<Package size={16} weight="light" />} label="Cargo Type" value={result.cargo_type} />
          <InfoBlock
            icon={<CalendarBlank size={16} weight="light" />}
            label={result.actual_delivery ? 'Delivered On' : 'Est. Delivery'}
            value={
              result.actual_delivery
                ? format(new Date(result.actual_delivery), 'MMM d, yyyy')
                : result.expected_delivery
                ? format(new Date(result.expected_delivery), 'MMM d, yyyy')
                : 'To be confirmed'
            }
          />
        </div>

        {/* Route */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex-1 text-right">
            <p className="font-display text-lg text-ink">{result.origin}</p>
            <p className="text-2xs text-mist uppercase tracking-wider">Origin</p>
          </div>
          <div className="flex flex-col items-center gap-1 shrink-0 px-2">
            <div className="w-2 h-2 rounded-full bg-gold" />
            <div className="w-16 h-px bg-rule" />
            <div className="w-2 h-2 rounded-full bg-ink" />
          </div>
          <div className="flex-1">
            <p className="font-display text-lg text-ink">{result.destination}</p>
            <p className="text-2xs text-mist uppercase tracking-wider">Destination</p>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      {!isCancelled && (
        <div className="bg-white border border-rule p-6 md:p-10 mb-8">
          <p className="eyebrow text-mist mb-8">Progress Tracker</p>
          {isOnHold && (
            <div className="bg-red-50 border border-red-200 p-4 mb-8">
              <p className="text-sm text-red-800">
                This shipment is currently on hold. Please contact our support team for details.
              </p>
            </div>
          )}
          <div className="space-y-0">
            {STATUS_PROGRESS_ORDER.map((status, idx) => {
              const isComplete = idx <= currentStepIndex && !isOnHold;
              const isCurrent = idx === currentStepIndex && !isOnHold;
              return (
                <div key={status} className="flex gap-4 relative pb-7 last:pb-0">
                  {idx !== STATUS_PROGRESS_ORDER.length - 1 && (
                    <div
                      className={`absolute left-[9px] top-6 bottom-0 w-px ${
                        isComplete ? 'bg-gold' : 'bg-rule'
                      }`}
                    />
                  )}
                  <div className="shrink-0 relative z-10 pt-0.5">
                    {isComplete ? (
                      <CheckCircle size={20} weight="fill" className="text-gold" />
                    ) : (
                      <Circle size={20} weight="light" className="text-rule" />
                    )}
                  </div>
                  <p
                    className={`text-sm pt-0.5 ${
                      isCurrent ? 'text-ink font-medium' : isComplete ? 'text-steel' : 'text-mist'
                    }`}
                  >
                    {STATUS_LABELS[status]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Shipment History */}
      {result.events.length > 0 && (
        <div className="bg-white border border-rule p-6 md:p-10 mb-8">
          <p className="eyebrow text-mist mb-8">Shipment History</p>
          <div className="space-y-6">
            {result.events.map((event, idx) => (
              <div key={idx} className="flex gap-5 pb-6 border-b border-rule last:border-0 last:pb-0">
                <div className="shrink-0 w-20 md:w-24">
                  <p className="text-xs font-mono text-mist">
                    {format(new Date(event.occurred_at), 'MMM d')}
                  </p>
                  <p className="text-2xs font-mono text-mist/70">
                    {format(new Date(event.occurred_at), 'HH:mm')}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-ink">{event.description}</p>
                  {event.location && (
                    <p className="text-xs text-mist mt-1 flex items-center gap-1">
                      <MapPin size={11} /> {event.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {result.documents.length > 0 && (
        <div className="bg-white border border-rule p-6 md:p-10">
          <p className="eyebrow text-mist mb-6">Documents</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.documents.map((doc, idx) => (
              <a
                key={idx}
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 border border-rule p-4 hover:border-ink transition-colors group"
              >
                <FileText size={20} weight="light" className="text-gold shrink-0" />
                <span className="text-sm text-ink flex-1 truncate">{doc.file_name}</span>
                <Download size={16} className="text-mist group-hover:text-ink shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBlock({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-gold mb-2">{icon}</div>
      <p className="text-2xs tracking-wider text-mist uppercase mb-1">{label}</p>
      <p className="text-sm text-ink font-medium">{value}</p>
    </div>
  );
}
