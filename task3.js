
const MAX_QUANTITY = 6;
const MIN_CODE = 100000;
const MAX_CODE = 999999;

const events = [
    { id: "football", name: "Football Match" },
    { id: "concert", name: "Music Concert" },
    { id: "esports", name: "Esports Tournament" }
];

const ticketTypes = [
    { id: "standard", name: "Standard", price: 5000 },
    { id: "premium", name: "Premium", price: 10000 },
    { id: "vip", name: "VIP", price: 20000 }
];

const availability = [
    { event: "football", date: "2026-11-10", type: "standard", seats: 20 },
    { event: "football", date: "2026-11-10", type: "premium", seats: 8 },
    { event: "football", date: "2026-11-10", type: "vip", seats: 3 },
    { event: "football", date: "2026-11-15", type: "standard", seats: 0 },
    { event: "football", date: "2026-11-15", type: "premium", seats: 0 },
    { event: "football", date: "2026-11-15", type: "vip", seats: 0 },
    { event: "football", date: "2026-11-20", type: "standard", seats: 12 },
    { event: "football", date: "2026-11-20", type: "premium", seats: 6 },
    { event: "football", date: "2026-11-20", type: "vip", seats: 2 },

    { event: "concert", date: "2026-11-10", type: "standard", seats: 30 },
    { event: "concert", date: "2026-11-10", type: "premium", seats: 10 },
    { event: "concert", date: "2026-11-10", type: "vip", seats: 5 },
    { event: "concert", date: "2026-11-15", type: "standard", seats: 25 },
    { event: "concert", date: "2026-11-15", type: "premium", seats: 10 },
    { event: "concert", date: "2026-11-15", type: "vip", seats: 4 },
    { event: "concert", date: "2026-11-20", type: "standard", seats: 0 },
    { event: "concert", date: "2026-11-20", type: "premium", seats: 0 },
    { event: "concert", date: "2026-11-20", type: "vip", seats: 0 },

    { event: "esports", date: "2026-11-10", type: "standard", seats: 18 },
    { event: "esports", date: "2026-11-10", type: "premium", seats: 7 },
    { event: "esports", date: "2026-11-10", type: "vip", seats: 2 },
    { event: "esports", date: "2026-11-15", type: "standard", seats: 16 },
    { event: "esports", date: "2026-11-15", type: "premium", seats: 5 },
    { event: "esports", date: "2026-11-15", type: "vip", seats: 2 },
    { event: "esports", date: "2026-11-20", type: "standard", seats: 10 },
    { event: "esports", date: "2026-11-20", type: "premium", seats: 4 },
    { event: "esports", date: "2026-11-20", type: "vip", seats: 1 }
];

const promoCodes = [
    { code: "STUDENT10", discount: 10 },
    { code: "AITU20", discount: 20 }
];

const form = document.getElementById("ticketForm");
form.noValidate = true;

const fields = {
    event: document.getElementById("event"),
    eventDate: document.getElementById("eventDate"),
    ticketType: document.getElementById("ticketType"),
    quantity: document.getElementById("quantity"),
    customerName: document.getElementById("customerName"),
    customerEmail: document.getElementById("customerEmail"),
    promoCode: document.getElementById("promoCode")
};

const summary = document.getElementById("formSummary");
const bookingResult = document.getElementById("bookingResult");

const touched = new Set();
const usedCodes = new Set();

function findAvailability() {
    return availability.find(item =>
        item.event === fields.event.value &&
        item.date === fields.eventDate.value &&
        item.type === fields.ticketType.value
    );
}

function getDiscount() {
    const code = fields.promoCode.value.trim().toUpperCase();

    return promoCodes.find(item => item.code === code);
}

function isDateSoldOut() {
    if (!fields.event.value || !fields.eventDate.value) {
        return false;
    }

    return !availability.some(item =>
        item.event === fields.event.value &&
        item.date === fields.eventDate.value &&
        item.seats > 0
    );
}

function validateField(name) {
    const field = fields[name];
    const value = field.value.trim();
    let error = "";

    if (!field.checkValidity()) {
        if (field.validity.valueMissing) {
            error = "This field is required.";
        } else if (field.validity.typeMismatch) {
            error = "Enter a valid value.";
        } else if (
            field.validity.rangeUnderflow ||
            field.validity.rangeOverflow
        ) {
            error = "Value is outside the allowed range.";
        } else if (field.validity.stepMismatch) {
            error = "Use a valid whole number.";
        } else if (
            field.validity.tooShort ||
            field.validity.tooLong
        ) {
            error = "Text length is not allowed.";
        } else {
            error = "Invalid value.";
        }
    }

    if (!error && name === "eventDate" && value) {
        if (isDateSoldOut()) {
            error = "This event date is sold out.";
        }
    }

    if (!error && name === "ticketType" && value) {
        if (fields.event.value && fields.eventDate.value) {
            const available = findAvailability();

            if (!available || available.seats === 0) {
                error = "This ticket type is sold out.";
            }
        }
    }

    if (!error && name === "quantity" && value) {
        const quantity = Number(value);

        if (quantity > MAX_QUANTITY) {
            error = "Maximum 6 tickets per booking.";
        } else if (
            fields.event.value &&
            fields.eventDate.value &&
            fields.ticketType.value
        ) {
            const available = findAvailability();

            if (!available) {
                error = "Tickets are not available.";
            } else if (available.seats === 0) {
                error = "This ticket type is sold out.";
            } else if (quantity > available.seats) {
                error = "Only " + available.seats + " seats left.";
            }
        }
    }

    if (!error && name === "promoCode" && value) {
        if (!getDiscount()) {
            error = "Invalid promo code.";
        }
    }

    return error;
}

function showFieldError(name, error) {
    const field = fields[name];
    const errorElement = document.getElementById(name + "Error");

    errorElement.textContent = error;

    field.setAttribute(
        "aria-invalid",
        error ? "true" : "false"
    );

    field.classList.toggle("invalid", Boolean(error));
    field.classList.toggle(
        "valid",
        !error && field.value.trim() !== ""
    );
}

function validateTouchedFields() {
    for (const name of touched) {
        showFieldError(name, validateField(name));
    }
}

function updatePreview() {
    const selectedEvent = events.find(
        item => item.id === fields.event.value
    );

    const selectedType = ticketTypes.find(
        item => item.id === fields.ticketType.value
    );

    const quantity = Number(fields.quantity.value) || 0;
    const promo = getDiscount();

    const discount = promo ? promo.discount : 0;
    const price = selectedType ? selectedType.price : 0;
    const total = price * quantity * (1 - discount / 100);

    document.getElementById("previewEvent").textContent =
        selectedEvent ? selectedEvent.name : "Not selected";

    document.getElementById("previewDate").textContent =
        fields.eventDate.value || "Not selected";

    document.getElementById("previewType").textContent =
        selectedType ? selectedType.name : "Not selected";

    document.getElementById("previewQuantity").textContent =
        fields.quantity.value || "0";

    document.getElementById("previewName").textContent =
        fields.customerName.value || "Not entered";

    document.getElementById("previewEmail").textContent =
        fields.customerEmail.value || "Not entered";

    document.getElementById("previewDiscount").textContent =
        discount + "%";

    document.getElementById("previewTotal").textContent =
        total.toLocaleString("en-US") + " KZT";
}

function updateForm() {
    updatePreview();
    validateTouchedFields();
}

for (const [name, field] of Object.entries(fields)) {
    field.addEventListener("blur", function () {
        touched.add(name);
        updateForm();
    });

    field.addEventListener("input", function () {
        updateForm();
    });

    field.addEventListener("change", function () {
        updateForm();
    });
}

function validateAll() {
    let errorCount = 0;
    let firstInvalid = null;

    for (const name of Object.keys(fields)) {
        const error = validateField(name);

        touched.add(name);
        showFieldError(name, error);

        if (error) {
            errorCount++;

            if (firstInvalid === null) {
                firstInvalid = fields[name];
            }
        }
    }

    return { errorCount, firstInvalid };
}

function createBookingCode() {
    let code;

    do {
        const number = Math.floor(
            Math.random() * (MAX_CODE - MIN_CODE + 1)
        ) + MIN_CODE;

        code = "BK-" + number;
    } while (usedCodes.has(code));

    usedCodes.add(code);
    return code;
}

function createBookingResult(code, total) {
    const card = document.createElement("div");
    card.classList.add("final-ticket");

    const title = document.createElement("h3");
    title.textContent = "Booking Confirmed";

    const bookingCode = document.createElement("p");
    bookingCode.textContent = "Booking Code: " + code;

    const eventName = document.createElement("p");
    const selectedEvent = events.find(
        item => item.id === fields.event.value
    );

    eventName.textContent = "Event: " + selectedEvent.name;

    const date = document.createElement("p");
    date.textContent = "Date: " + fields.eventDate.value;

    const type = document.createElement("p");
    type.textContent = "Type: " + fields.ticketType.value;

    const quantity = document.createElement("p");
    quantity.textContent = "Quantity: " + fields.quantity.value;

    const customer = document.createElement("p");
    customer.textContent = "Name: " + fields.customerName.value;

    const amount = document.createElement("p");
    amount.textContent =
        "Total: " + total.toLocaleString("en-US") + " KZT";

    card.appendChild(title);
    card.appendChild(bookingCode);
    card.appendChild(eventName);
    card.appendChild(date);
    card.appendChild(type);
    card.appendChild(quantity);
    card.appendChild(customer);
    card.appendChild(amount);

    bookingResult.replaceChildren(card);
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const result = validateAll();

    if (result.errorCount > 0) {
        summary.hidden = false;
        summary.textContent =
            result.errorCount + " field(s) need correction.";

        result.firstInvalid.focus();
        return;
    }

    const selectedType = ticketTypes.find(
        item => item.id === fields.ticketType.value
    );

    const promo = getDiscount();
    const discount = promo ? promo.discount : 0;

    const total =
        selectedType.price *
        Number(fields.quantity.value) *
        (1 - discount / 100);

    const available = findAvailability();

    if (!available || available.seats < Number(fields.quantity.value)) {
        summary.hidden = false;
        summary.textContent = "Not enough seats available.";
        fields.quantity.focus();
        return;
    }

    const code = createBookingCode();

    createBookingResult(code, total);

    available.seats -= Number(fields.quantity.value);

    summary.hidden = true;
    summary.textContent = "";

    form.reset();
    touched.clear();

    for (const name of Object.keys(fields)) {
        showFieldError(name, "");
    }

    updatePreview();
});

updatePreview();
