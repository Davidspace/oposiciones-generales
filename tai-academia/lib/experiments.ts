export const EXPERIMENT_IDS = ["tai-academia"] as const;
export type ExperimentId = (typeof EXPERIMENT_IDS)[number];

export const ALLOWED_EXPERIMENTS = new Set<string>(EXPERIMENT_IDS);

export const FUNNEL_EVENT_TYPES = [
  "landing_view",
  "offer_view",
  "diagnostic_start",
  "diagnostic_answered",
  "diagnostic_complete",
  "lead_submit",
  "order_form_start",
  "bizum_instructions_viewed",
  "whatsapp_click",
] as const;
export type FunnelEventType = (typeof FUNNEL_EVENT_TYPES)[number];

export const ALLOWED_FUNNEL_EVENTS = new Set<string>(FUNNEL_EVENT_TYPES);

type PublicMetadata = Record<string, string | number | boolean | null>;
type MetadataValidator = (value: unknown) => value is string | number | boolean | null;

const integerBetween = (minimum: number, maximum: number): MetadataValidator =>
  (value): value is number =>
    Number.isInteger(value) &&
    typeof value === "number" &&
    value >= minimum &&
    value <= maximum;
const booleanValue: MetadataValidator = (value): value is boolean =>
  typeof value === "boolean";
const oneOf = (values: readonly string[]): MetadataValidator => {
  const allowed = new Set(values);
  return (value): value is string =>
    typeof value === "string" && allowed.has(value);
};
const slug: MetadataValidator = (value): value is string =>
  typeof value === "string" && /^[a-z0-9][a-z0-9-]{0,39}$/.test(value);
const questionId: MetadataValidator = (value): value is string =>
  typeof value === "string" && /^(?:q\d+|(?:g|ss)-\d{2}-q\d{3})$/.test(value);

const EVENT_METADATA: Record<
  FunnelEventType,
  Readonly<Record<string, MetadataValidator>>
> = {
  landing_view: {},
  offer_view: { section: slug },
  diagnostic_start: {},
  diagnostic_answered: {
    questionId,
    answerState: oneOf(["chosen", "blank"]),
  },
  diagnostic_complete: {
    correct: integerBetween(0, 100),
    unanswered: integerBetween(0, 100),
    dominantError: slug,
    scoreBand: oneOf(["no-data", "solid", "developing", "priority"]),
  },
  lead_submit: {
    completedDiagnostic: booleanValue,
    scoreBand: oneOf([
      "not-completed",
      "no-data",
      "solid",
      "developing",
      "priority",
    ]),
  },
  order_form_start: { productId: slug, offerVersion: slug },
  bizum_instructions_viewed: {
    orderStatus: oneOf(["awaiting-payment", "payment-reported", "needs-review"]),
  },
  whatsapp_click: {
    context: oneOf(["header", "offer", "order-status", "support"]),
  },
};

export function isExperimentId(value: string): value is ExperimentId {
  return ALLOWED_EXPERIMENTS.has(value);
}

export function isFunnelEventType(value: string): value is FunnelEventType {
  return ALLOWED_FUNNEL_EVENTS.has(value);
}

export function sanitizeFunnelMetadata(
  eventType: FunnelEventType,
  value: unknown,
): PublicMetadata | null {
  if (value === undefined || value === null) return {};
  if (typeof value !== "object" || Array.isArray(value)) return null;

  const schema = EVENT_METADATA[eventType];
  const entries = Object.entries(value);
  if (entries.length > Object.keys(schema).length) return null;

  const result: PublicMetadata = {};
  for (const [key, entryValue] of entries) {
    const validator = schema[key];
    if (!validator || !validator(entryValue)) return null;
    result[key] = entryValue;
  }
  return result;
}
