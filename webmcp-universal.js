export const DEFAULT_API_ROOT = "https://uz-ibe.hopenapi.com/ApiWebDistribution/mcp/";
const DAY_MS = 86400000;
const INPUT_KEYS = ["hotel_code", "checkin", "checkout", "adults", "language", "currency"];
const DEFAULT_CURRENCY = "USD";
const UNSUPPORTED_GUEST_KEYS = ["children", "rooms"];
const ADULT_PLACEMENT_KINDS = new Set(["adult", "extra_adult"]);
const CHILD_PLACEMENT_KINDS = new Set(["child", "extra_child", "child_without_bed", "infant"]);

class SearchError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
const fail = (code, message) => { throw new SearchError(code, message); };
const list = value => Array.isArray(value) ? value : [];
const bool = value => typeof value === "boolean" ? value : null;
const indexBy = (items, key) => new Map(list(items).map(item => [String(item[key]), item]));
const codeOf = value => value == null ? null : String(value);
const textOf = value => typeof value === "string" ? value : null;
const isRecord = value => value !== null && typeof value === "object" && !Array.isArray(value);

/** Accept additive placement kinds without claiming to know their guest/bed semantics. */
function occupancyOf(stay, query, warnings) {
  const guests = list(stay.guests);
  if (!guests.length || guests.some(guest => !isRecord(guest) || !isRecord(guest.placement) ||
      typeof guest.placement.kind !== "string" || !guest.placement.kind.trim() ||
      !Number.isSafeInteger(guest.count) || guest.count < 1) ||
      guests.reduce((count, guest) => count + guest.count, 0) !== query.adults) {
    fail("unexpected_response", "The guest count or guest structure in the response does not match the request.");
  }
  if (guests.some(guest => CHILD_PLACEMENT_KINDS.has(guest.placement.kind))) {
    fail("unexpected_response", "The API returned a child placement for an adults-only request.");
  }
  const placements = list(stay.room_types[0].placements);
  const unknownGuestKinds = [...new Set(guests.map(guest => guest.placement.kind)
    .filter(kind => !ADULT_PLACEMENT_KINDS.has(kind)))];
  const unknownKinds = [...new Set([...unknownGuestKinds, ...placements
    .filter(placement => isRecord(placement) && typeof placement.kind === "string" && placement.kind.trim())
    .map(placement => placement.kind).filter(kind => !ADULT_PLACEMENT_KINDS.has(kind))])];
  if (unknownKinds.length) {
    warnings.add(`Unknown placement kinds returned by the API: ${unknownKinds.join(", ")}. Original placement data is preserved; do not assume their guest eligibility or bed type.`);
  }
  return {
    requested_adults: query.adults,
    returned_guest_count: guests.reduce((count, guest) => count + guest.count, 0),
    adult_composition_confirmed: unknownGuestKinds.length === 0,
    unknown_placement_kinds: unknownKinds,
    guests_reported_by_api: guests.map(guest => ({ ...guest, placement: { ...guest.placement } })),
    placements_reported_by_api: placements.map(placement => isRecord(placement) ? { ...placement } : placement)
  };
}

function dateValue(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    fail("invalid_input", "Dates must be in YYYY-MM-DD format.");
  }
  const time = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value) {
    fail("invalid_input", "The date does not exist in the calendar.");
  }
  return time;
}

export function validateQuery(input, { hotelCode, defaultCurrency = DEFAULT_CURRENCY, allowedCurrencies } = {}) {
  const allowedKeys = hotelCode === undefined ? INPUT_KEYS : INPUT_KEYS.filter(key => key !== "hotel_code");
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    fail("invalid_input", `Provide ${hotelCode === undefined ? "hotel_code, " : ""}checkin, checkout and adults.`);
  }
  if (UNSUPPORTED_GUEST_KEYS.some(key => key in input)) {
    fail("invalid_input", "Only one room and adult guests are supported: children and rooms are not accepted.");
  }
  if (Object.keys(input).some(key => !allowedKeys.includes(key))) {
    fail("invalid_input", `Allowed parameters: ${allowedKeys.join(", ")}.${hotelCode === undefined ? "" : " The hotel is configured by the site; omit hotel_code."}`);
  }
  const hotel_code = hotelCode === undefined ? input.hotel_code : hotelCode;
  const { checkin, checkout, adults, language = "ru-ru", currency = defaultCurrency } = input;
  if (typeof hotel_code !== "string" || !/^\d+$/.test(hotel_code)) {
    fail("invalid_input", "hotel_code must be a non-empty string of digits; leading zeros are preserved.");
  }
  if (typeof language !== "string" || !/^[a-zA-Z]{2,3}-[a-zA-Z]{2}$/.test(language)) {
    fail("invalid_input", "Specify language as language-country, for example ru-ru or en-us.");
  }
  if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) {
    fail("invalid_input", "Currency must be a three-letter uppercase code, for example USD or EUR.");
  }
  if (allowedCurrencies && !allowedCurrencies.includes(currency)) {
    fail("invalid_input", `Specify currency from the list: ${allowedCurrencies.join(", ")}.`);
  }
  const start = dateValue(checkin), end = dateValue(checkout);
  if (end <= start) fail("invalid_input", "Check-out must be later than check-in.");
  if (!Number.isSafeInteger(adults) || adults < 1) {
    fail("invalid_input", "Adults must be a positive integer.");
  }
  return { hotel_code, checkin, checkout, adults, language: language.toLowerCase(), currency, rooms: 1, nights: (end - start) / DAY_MS };
}

function apiBase(apiRoot) {
  const url = new URL(apiRoot);
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) {
    throw new TypeError("apiRoot must be an HTTPS base URL without credentials, query or fragment.");
  }
  url.pathname = `${url.pathname.replace(/\/+$/, "")}/`;
  return url;
}

export function buildAvailabilityURL(query, apiRoot = DEFAULT_API_ROOT) {
  const url = new URL("hotel_availability", apiBase(apiRoot));
  url.search = new URLSearchParams({
    currency: query.currency ?? DEFAULT_CURRENCY,
    include_all_placements: "false",
    include_promo_restricted: "false",
    include_rates: "true",
    include_transfers: "true",
    language: query.language ?? "ru-ru",
    "criterions[0].adults": String(query.adults),
    "criterions[0].dates": `${query.checkin};${query.checkout}`,
    "criterions[0].hotels[0].code": query.hotel_code,
    audience: "BookingForm"
  }).toString();
  return url;
}

export function buildHotelInfoURL(query, apiRoot = DEFAULT_API_ROOT) {
  const url = new URL("hotel_info", apiBase(apiRoot));
  url.search = new URLSearchParams({
    "hotels[0].code": query.hotel_code, language: query.language ?? "ru-ru", audience: "BookingForm"
  }).toString();
  return url;
}

function hasQuotedPrice(total) {
  return isRecord(total) && Number.isFinite(total.price_after_tax) && total.price_after_tax >= 0 &&
    typeof total.currency === "string" && /^[A-Z]{3}$/.test(total.currency);
}

function money(total, sourceField) {
  if (!hasQuotedPrice(total)) {
    fail("unexpected_response", `The API did not return a valid amount or currency: ${sourceField}.`);
  }
  return {
    amount: total.price_after_tax,
    currency: total.currency,
    scope: "entire_stay_for_requested_guests",
    source_field: sourceField,
    price_before_tax: Number.isFinite(total.price_before_tax) ? total.price_before_tax : null,
    taxes_reported_by_api: list(total.taxes),
    all_mandatory_charges_confirmed: null,
    discount_already_applied: total.discount ?? null
  };
}

function httpsURL(value) {
  try { const u = new URL(value); return u.protocol === "https:" ? u.href : null; }
  catch { return null; }
}

function bookingLink(buildBookingURL, args, warnings) {
  if (!buildBookingURL) return { url: null, reason: "booking_url_not_configured" };
  try {
    const value = buildBookingURL(args);
    const url = typeof value === "string" ? httpsURL(value) : null;
    if (url) return { url };
  } catch { /* Link configuration must not discard valid availability. */ }
  warnings.add("No valid booking link is configured for this offer; booking.url is null.");
  return { url: null, reason: "booking_url_unavailable" };
}

const hasItems = value => Array.isArray(value) ? value.length > 0 : Boolean(value);

function firstMessage(items) {
  const item = Array.isArray(items) ? items[0] : items;
  const text = typeof item === "string" ? item : item?.message;
  return typeof text === "string" && text.trim() ? text.trim() : null;
}

/** The API also answers HTTP 200 on errors: non-empty errors or warnings do not mean "no rooms". */
function assertNoApiMessages(response, endpoint) {
  for (const [key, label] of [["errors", "an error"], ["warnings", "a warning"]]) {
    const items = response?.[key];
    if (hasItems(items)) {
      const text = firstMessage(items) ?? "no description";
      fail("api_error", `API (${endpoint}) reported ${label}: ${text}. This does not mean there are no rooms.`);
    }
  }
}

function requestedHotel(info, hotelCode) {
  assertNoApiMessages(info, "hotel_info");
  if (!info || !Array.isArray(info.hotels)) {
    fail("unexpected_response", "hotel_info did not return a hotels array.");
  }
  const hotel = info.hotels.find(item => item && String(item.code) === hotelCode);
  if (!hotel) fail("hotel_not_found", `Hotel ${hotelCode} is not available in hotel_info on this API server.`);
  return hotel;
}

/** Date syntax is checked before I/O; the local calendar date requires hotel metadata. */
export function validateHotelDates(query, hotel, now = new Date(), resolveTimeZone) {
  let timeZone;
  try {
    timeZone = resolveTimeZone ? resolveTimeZone({ hotelCode: query.hotel_code, hotel }) : hotel.timezone;
    // hotel_info may return { name: "(UTC+05:00) ...", offset: "+05:00" }.
    // The display name is not an IANA identifier; use the explicit UTC offset.
    if (timeZone && typeof timeZone === "object") timeZone = timeZone.offset;
    if (typeof timeZone !== "string" || !timeZone.trim()) throw new Error("Missing timezone");
    timeZone = timeZone.trim();
    let today;
    if (/^[+-](?:[01]\d|2[0-3]):[0-5]\d$/.test(timeZone)) {
      const minutes = (Number(timeZone.slice(1, 3)) * 60 + Number(timeZone.slice(4, 6))) * (timeZone[0] === "-" ? -1 : 1);
      // Arithmetic also works in browsers without Intl support for offset identifiers.
      today = new Date(now.getTime() + minutes * 60000).toISOString().slice(0, 10);
    } else {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone, calendar: "gregory", numberingSystem: "latn",
        year: "numeric", month: "2-digit", day: "2-digit"
      }).formatToParts(now);
      const fields = Object.fromEntries(parts.map(part => [part.type, part.value]));
      today = `${fields.year}-${fields.month}-${fields.day}`;
    }
    if (query.checkin < today) {
      fail("invalid_input", `The check-in date is already in the past in the hotel's timezone (${timeZone}).`);
    }
  } catch (error) {
    if (error instanceof SearchError) throw error;
    fail("hotel_timezone_unavailable", "The hotel has no usable timezone. Configure resolveTimeZone to return its IANA timezone or UTC offset (+HH:MM or -HH:MM).");
  }
  return timeZone;
}

/** Join only references returned by this availability call; catalog entries alone are not offers. */
export function normalizeResponse(availability, info, query, checkedAt = new Date().toISOString(), { buildBookingURL, timeZone } = {}) {
  assertNoApiMessages(availability, "hotel_availability");
  assertNoApiMessages(info, "hotel_info");
  if (!availability || !Array.isArray(availability.availability_result)) {
    fail("unexpected_response", "hotel_availability returned an unknown status: the response shows neither available nor unavailable rooms.");
  }
  if (!Array.isArray(availability.room_stays) || !info || !Array.isArray(info.hotels)) {
    fail("unexpected_response", "The API response structure has changed.");
  }
  const availabilityMessages = [];
  if (availability.availability_result.length) {
    const knownNoOffers = availability.room_stays.length === 0 && availability.availability_result.every(item =>
      isRecord(item) && String(item.criterion_ref) === "0" &&
      typeof item.no_room_type_availability_message === "string" && item.no_room_type_availability_message.trim());
    if (!knownNoOffers) {
      fail("unexpected_response", "hotel_availability returned an unknown or inconsistent availability status.");
    }
    availabilityMessages.push(...availability.availability_result.map(item => item.no_room_type_availability_message.trim()));
  }
  const hotel = requestedHotel(info, query.hotel_code);
  const rooms = indexBy(hotel.room_types, "code");
  const plans = indexBy(hotel.rate_plans, "code");
  const serviceInfo = indexBy(hotel.services, "code");
  const services = indexBy(availability.services, "rph");
  const paymentInfo = indexBy(hotel.guarantees, "code");
  const transferInfo = indexBy(hotel.transfers, "transfer_code");
  const transfers = indexBy(availability.transfers, "rph");
  const vehicles = indexBy(hotel.vehicles, "vehicle_code");
  const quotas = indexBy(availability.room_type_quotas, "rph");
  const warnings = new Set();
  if (!buildBookingURL) warnings.add("Booking links are not configured; booking.url is null.");
  let excludedRestrictedOffers = 0;

  const offers = availability.room_stays.map((stay, position) => {
    if (!isRecord(stay) || String(stay.hotel_ref?.code) !== query.hotel_code || String(stay.criterion_ref) !== "0" ||
        !Array.isArray(stay.room_types) || stay.room_types.length !== 1 || !isRecord(stay.room_types[0]) ||
        !Array.isArray(stay.rate_plans) || stay.rate_plans.length !== 1 || !isRecord(stay.rate_plans[0])) {
      fail("unexpected_response", "Received an unsupported combination of hotel, rooms or rate plans.");
    }
    if (typeof stay.stay_dates?.start_date !== "string" || typeof stay.stay_dates?.end_date !== "string" ||
        stay.stay_dates.start_date.slice(0, 10) !== query.checkin ||
        stay.stay_dates.end_date.slice(0, 10) !== query.checkout) {
      fail("unexpected_response", "The dates in the response do not match the request.");
    }
    const occupancy = occupancyOf(stay, query, warnings);
    // Defensive handling if the server still includes closed promo records without a quote.
    if (list(stay.restrictions).includes("promo") && !hasQuotedPrice(stay.total)) {
      excludedRestrictedOffers++;
      warnings.add("Closed promo offers without a valid quoted price were excluded. Their prices and eligibility are not available for this search.");
      return null;
    }
    const rt = stay.room_types[0], rp = stay.rate_plans[0];
    const room = rooms.get(String(rt.code));
    const plan = plans.get(String(rp.code));
    if (!room || !plan) warnings.add("Some names were not found in hotel_info; API codes are kept.");
    const serviceQuotes = new Map();
    for (const ref of list(stay.services)) {
      if (!isRecord(ref) || ref.rph == null) {
        warnings.add("An invalid service reference was omitted from the offer.");
        continue;
      }
      const reference = String(ref.rph);
      const existing = serviceQuotes.get(reference);
      const application = { ...ref, ...(Array.isArray(ref.guest_refs) ? { guest_refs: ref.guest_refs.slice() } : {}) };
      if (existing) {
        existing.applications_reported_by_api.push(application);
        const applicability = ref.applicability_type ?? services.get(reference)?.applicability_type ?? null;
        if (existing.applicability !== applicability) existing.applicability = null;
        continue;
      }
      const price = services.get(String(ref.rph));
      const definition = serviceInfo.get(String(price?.code));
      if (!price || !definition) warnings.add("Some services are not described by the reference data.");
      serviceQuotes.set(reference, {
        code: codeOf(price?.code), reference: codeOf(ref.rph), name: definition?.name ?? null,
        included: bool(price?.inclusive), quantity: price?.quantity ?? null,
        charge_type: definition?.charge_type ?? null,
        applicability: ref.applicability_type ?? price?.applicability_type ?? null,
        applications_reported_by_api: [application],
        meal_plan_type: definition?.meal_plan_type ?? null,
        quoted_price: price?.price ? { ...money(price.price, "services[].price"), scope: "as_quoted_by_api_for_service" } : null
      });
    }
    const quotedServices = [...serviceQuotes.values()];
    const cancellation = rp.cancel_penalty_group;
    let loyalty = null;
    if (stay.loyalty_closed_total) {
      loyalty = {
        ...money(stay.loyalty_closed_total, "room_stays[].loyalty_closed_total"),
        label: "Loyalty price reported by the API",
        eligibility: "not_verified",
        eligibility_conditions: null,
        notice: "Eligibility and conditions have not been verified. Confirm them with the hotel or in its booking form; this price is not guaranteed for the guest."
      };
    }
    if (rp.promo === true) warnings.add("Some offers have promo=true; whether the promo rate is available to the guest must be checked in the booking form.");
    const price = money(stay.total, "room_stays[].total");
    if (price.currency !== query.currency) {
      warnings.add(`The API returned ${price.currency} instead of the requested ${query.currency}; use the currency of each price.`);
    }
    const quota = quotas.get(String(rt.room_type_quota_rph));
    return {
      offer_id: `${query.hotel_code}:${rt.code}:${rp.code}:${position}`,
      room: {
        code: String(rt.code), name: room?.name ?? null, description: textOf(room?.description),
        size: room?.size ?? null, max_occupancy: room?.max_occupancy ?? null,
        images: list(room?.images).map(image => httpsURL(image.url)).filter(Boolean).slice(0, 3),
        limited_inventory_count: rt.limited_inventory_count ?? null,
        quota_reported_by_api: quota?.quantity ?? null
      },
      rate: { code: String(rp.code), name: plan?.name ?? null, promo: bool(rp.promo) },
      stay_dates: stay.stay_dates,
      occupancy,
      price,
      loyalty_price: loyalty,
      meals_included: quotedServices.filter(s => s.included === true && s.meal_plan_type).map(s => ({ name: s.name, type: s.meal_plan_type })),
      services: quotedServices,
      cancellation: {
        free_cancellation: bool(cancellation?.free_cancellation),
        description: textOf(cancellation?.description),
        penalties: list(cancellation?.cancel_penalties).map(p => ({ code: codeOf(p.code), description: textOf(p.description) })),
        source: "date_specific_availability"
      },
      payment_options: list(stay.guarantees).map(g => {
        const definition = paymentInfo.get(String(g.code));
        return { code: codeOf(g.code), type: g.type ?? null,
          payment_system_code: definition?.payment_system_code ?? null,
          requires_prepayment: bool(definition?.require_prepayment) };
      }),
      optional_transfers: list(stay.transfers).map(ref => {
        const transfer = transfers.get(String(ref.rph));
        const definition = transferInfo.get(String(transfer?.transfer_code));
        return { code: codeOf(transfer?.transfer_code), name: definition?.name ?? null,
          direction: definition?.direction ?? null,
          vehicles: list(transfer?.vehicles).map(v => ({
            code: codeOf(v.vehicle_code), name: vehicles.get(String(v.vehicle_code))?.name ?? null,
            price: v.price ? { ...money(v.price, "transfers[].vehicles[].price"), scope: "as_quoted_by_api_for_transfer" } : null
          })) };
      }),
      booking: bookingLink(buildBookingURL, {
        hotelCode: query.hotel_code, query, roomCode: String(rt.code), rateCode: String(rp.code), currency: price.currency
      }, warnings)
    };
  }).filter(offer => offer !== null);
  // Preserve API order: comparing amounts across currencies would be misleading.
  return {
    status: offers.length ? "available" : "no_offers",
    checked_at: checkedAt,
    query,
    localization: { requested_language: query.language ?? "ru-ru", returned_language: null,
      notice: "The language was passed to both APIs. Translations are returned as is; the API does not confirm the actual language and may fall back to another one when a translation is missing." },
    hotel: { code: query.hotel_code, name: hotel.name, timezone: timeZone ?? hotel.timezone ?? null, policy: hotel.policy },
    offers,
    availability_messages: availabilityMessages,
    excluded_restricted_offers: excludedRestrictedOffers,
    warnings: [...warnings],
    notes: [
      "price is total.price_after_tax for the whole requested period and guests; the discount is already applied.",
      "The currency of each price is taken from hotel_availability. The currency of the rate plan reference may differ.",
      "An empty taxes array does not confirm that there are no mandatory charges. Additional services and transfers are not added to the total.",
      "Eligibility and conditions for loyalty_price have not been verified; do not assume registration is sufficient.",
      "The result is an offer at the time of the check; no booking has been created."
    ]
  };
}

function createSingleAvailabilityTool({
  fetchImpl = globalThis.fetch, now = () => new Date(), timeoutMs = 15000,
  apiRoot = DEFAULT_API_ROOT, defaultCurrency = DEFAULT_CURRENCY, allowedCurrencies,
  hotelCode, resolveTimeZone, buildBookingURL
} = {}) {
  const base = apiBase(apiRoot);
  if (hotelCode !== undefined && (typeof hotelCode !== "string" || !/^\d+$/.test(hotelCode))) {
    throw new TypeError("hotelCode must be a non-empty string of digits, preserving leading zeros.");
  }
  if (typeof defaultCurrency !== "string" || !/^[A-Z]{3}$/.test(defaultCurrency) ||
      (allowedCurrencies !== undefined && (!Array.isArray(allowedCurrencies) || !allowedCurrencies.length ||
        allowedCurrencies.some(value => typeof value !== "string" || !/^[A-Z]{3}$/.test(value)) || !allowedCurrencies.includes(defaultCurrency)))) {
    throw new TypeError("Configure a valid defaultCurrency and, optionally, a non-empty allowedCurrencies list containing it.");
  }
  if (typeof fetchImpl !== "function" || typeof now !== "function" ||
      !Number.isSafeInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 2147483647 ||
      (resolveTimeZone !== undefined && typeof resolveTimeZone !== "function") ||
      (buildBookingURL !== undefined && typeof buildBookingURL !== "function")) {
    throw new TypeError("Invalid fetchImpl, now, timeoutMs, resolveTimeZone or buildBookingURL configuration.");
  }
  const currencies = allowedCurrencies?.slice();
  return {
    name: "search_availability",
    description: `Get current offers ${hotelCode === undefined ? "for a hotel_code accessible through the configured booking API" : `for this site's configured hotel (${hotelCode}); do not pass hotel_code`}, for one room and adult guests. Dates use the hotel's timezone. Language defaults to ru-ru; currency defaults to ${defaultCurrency}. Always use each price.currency, since the API may return another currency. Returns rooms, rates, total prices, meals, cancellation, payment options and occupancy. Show additional adult placements and their API-reported details. Unknown placement kinds are preserved with warnings; if occupancy.adult_composition_confirmed is false, do not claim that adult eligibility or bed type is confirmed. Service prices are as quoted by the API; applications_reported_by_api preserves guest/placement applicability and does not establish a full-party total. A loyalty_price is conditional: eligibility and conditions are not verified; do not assume registration is sufficient or promise this price. If loyalty_price is null, do not invent a discount. Give the guest booking.url only when it is non-null; links require hotel-specific configuration. Does not support children or multiple rooms and does not create a booking.`,
    inputSchema: {
      type: "object", additionalProperties: false,
      properties: {
        ...(hotelCode === undefined ? {
          hotel_code: { type: "string", pattern: "^[0-9]+$", description: "Hotel identifier on the configured API server. Pass as a string, preserving leading zeros." }
        } : {}),
        checkin: { type: "string", format: "date", description: "Check-in date, YYYY-MM-DD, in the hotel's timezone." },
        checkout: { type: "string", format: "date", description: "Check-out date, YYYY-MM-DD; later than check-in." },
        adults: { type: "integer", minimum: 1, description: "Number of adults in one room. Pass it explicitly." },
        language: { type: "string", pattern: "^[a-zA-Z]{2,3}-[a-zA-Z]{2}$", default: "ru-ru",
          description: "Language of the API texts, for example ru-ru or en-us. Choose it by the guest's language. Support for other locales and the completeness of translations depend on the API." },
        currency: { type: "string", pattern: "^[A-Z]{3}$", ...(currencies ? { enum: currencies.slice() } : {}), default: defaultCurrency,
          description: `Requested price currency; default ${defaultCurrency}. Actual currency depends on the API response.` }
      },
      required: [...(hotelCode === undefined ? ["hotel_code"] : []), "checkin", "checkout", "adults"]
    },
    annotations: { readOnlyHint: true },
    async execute(input) {
      const controller = new AbortController();
      let timedOut = false;
      const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
      try {
        const query = validateQuery(input, { hotelCode, defaultCurrency, allowedCurrencies: currencies });
        const getJSON = async url => {
          const response = await fetchImpl(url.href, {
            method: "GET", mode: "cors", credentials: "omit", cache: "no-store",
            headers: { Accept: "application/json" }, signal: controller.signal
          });
          if (!response.ok) fail("api_http_error", `The API responded with HTTP ${response.status}.`);
          try { return await response.json(); }
          catch { fail("unexpected_response", "The API returned unreadable JSON."); }
        };
        const info = await getJSON(buildHotelInfoURL(query, base));
        const hotel = requestedHotel(info, query.hotel_code);
        const timeZone = validateHotelDates(query, hotel, now(), resolveTimeZone);
        const availability = await getJSON(buildAvailabilityURL(query, base));
        return normalizeResponse(availability, info, query, now().toISOString(), { buildBookingURL, timeZone });
      } catch (error) {
        controller.abort();
        return {
          status: "error", offers: [],
          error: { code: timedOut ? "timeout" : error instanceof SearchError ? error.code : "network_or_cors_error",
            message: timedOut ? "The API did not respond in time. This does not mean there are no rooms."
              : error instanceof SearchError ? error.message
              : "Could not get a response from the API. Check the network, CORS and the site's Content-Security-Policy." }
        };
      } finally { clearTimeout(timer); }
    }
  };
}

const MAX_BATCH_HOTELS = 1000;

function hotelCodeList(value) {
  if (!Array.isArray(value) || !value.length || value.length > MAX_BATCH_HOTELS ||
      Array.from(value).some(code => typeof code !== "string" || !/^\d+$/.test(code))) {
    fail("invalid_input", `Provide 1 to ${MAX_BATCH_HOTELS} hotel codes as non-empty strings of digits.`);
  }
  return [...new Set(value)];
}

/** A site's configured list is an allowlist; each hotel keeps its own API result. */
export function createAvailabilityTool({ hotelCodes, concurrency = 4, ...options } = {}) {
  if (!Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 16) {
    throw new TypeError("concurrency must be an integer from 1 to 16.");
  }
  if (hotelCodes === undefined) return createSingleAvailabilityTool(options);
  if (options.hotelCode !== undefined) {
    throw new TypeError("Configure either hotelCode or hotelCodes, not both.");
  }
  let configuredCodes;
  try { configuredCodes = hotelCodeList(hotelCodes); }
  catch (error) { throw new TypeError(`Invalid hotelCodes: ${error.message}`); }
  const allowedCodes = new Set(configuredCodes);
  const single = createSingleAvailabilityTool(options);
  const { hotel_code: omitted, ...properties } = single.inputSchema.properties;
  const currencies = options.allowedCurrencies?.slice();
  const waiting = [];
  let running = 0;
  const startNext = () => {
    while (running < concurrency && waiting.length) {
      running++;
      waiting.shift()();
    }
  };
  async function searchHotel(query) {
    await new Promise(resolve => { waiting.push(resolve); startNext(); });
    try { return await single.execute(query); }
    finally { running--; startNext(); }
  }
  return {
    name: single.name,
    description: single.description.replace("for a hotel_code accessible through the configured booking API",
      `for this site's configured list of ${configuredCodes.length} hotels; omit hotel_codes to search all of them, or select an allowed subset with hotel_codes; do not pass hotel_code`) +
      " Returns hotels[], each with hotel_code and its own status, offers, query, warnings or error. Never merge currencies or hotel identities. Batch status complete means all searches finished without errors, not that every hotel has offers; partial_error means some hotels failed; error means all failed or the input was invalid. Use summary and individual results; never describe failed searches as no availability. timeoutMs applies to each hotel after it leaves the queue.",
    inputSchema: {
      type: "object", additionalProperties: false,
      properties: {
        hotel_codes: {
          type: "array", minItems: 1, maxItems: MAX_BATCH_HOTELS,
          items: { type: "string", pattern: "^[0-9]+$", enum: configuredCodes.slice() },
          description: "Optional subset of the site's configured hotels. Omit to search all. Codes are strings; leading zeros are preserved. Duplicates are searched once, in first-occurrence order."
        },
        ...properties
      },
      required: ["checkin", "checkout", "adults"]
    },
    annotations: { ...single.annotations },
    async execute(input) {
      let selected, common;
      try {
        if (!isRecord(input)) fail("invalid_input", "Provide checkin, checkout and adults, optionally hotel_codes.");
        const { hotel_codes, ...search } = input;
        selected = Object.hasOwn(input, "hotel_codes") ? hotelCodeList(hotel_codes) : configuredCodes.slice();
        if (selected.some(code => !allowedCodes.has(code))) {
          fail("invalid_input", "hotel_codes may contain only hotels configured by this site.");
        }
        const { hotel_code, ...validated } = validateQuery(search, {
          hotelCode: selected[0], defaultCurrency: options.defaultCurrency, allowedCurrencies: currencies
        });
        const { rooms, nights, ...parameters } = validated;
        common = parameters;
      } catch (error) {
        return { status: "error", hotels: [], error: { code: "invalid_input", message: error.message } };
      }
      const hotels = await Promise.all(selected.map(async hotel_code => ({
        hotel_code, ...await searchHotel({ hotel_code, ...common })
      })));
      const summary = {
        total: hotels.length,
        available: hotels.filter(hotel => hotel.status === "available").length,
        no_offers: hotels.filter(hotel => hotel.status === "no_offers").length,
        errors: hotels.filter(hotel => hotel.status === "error").length,
        offers: hotels.reduce((count, hotel) => count + hotel.offers.length, 0)
      };
      return {
        status: summary.errors === summary.total ? "error" : summary.errors ? "partial_error" : "complete",
        checked_at: new Date().toISOString(), query: { hotel_codes: selected, ...common }, summary, hotels
      };
    }
  };
}

export async function registerWebMCP({ context = globalThis.document?.modelContext, ...options } = {}) {
  if (typeof context?.registerTool !== "function") return { registered: false, reason: "webmcp_unavailable" };
  const tool = createAvailabilityTool(options);
  await context.registerTool(tool);
  return { registered: true, name: tool.name };
}

// Loading the module on a top-level page registers the tool automatically.
// Optional installation settings must be assigned before importing this module.
if (typeof window !== "undefined" && window.top === window && typeof document !== "undefined") {
  registerWebMCP(globalThis.hotelWebMCPOptions ?? {})
    .catch(error => console.error("Hotel WebMCP: tool registration failed", error));
}

