import { Baby, HeartPulse, Stethoscope, Activity, type LucideIcon, type LucideProps } from "lucide-react";

export const PregnantIcon = (props: LucideProps) => <Baby {...props} />;
export const UterusIcon = (props: LucideProps) => <HeartPulse {...props} />;
export const ScopeIcon = (props: LucideProps) => <Stethoscope {...props} />;
export const ProbeIcon = (props: LucideProps) => <Activity {...props} />;

export const IconMap: Record<string, React.FC<LucideProps>> = {
    PregnantIcon,
    UterusIcon,
    ScopeIcon,
    ProbeIcon,
};
