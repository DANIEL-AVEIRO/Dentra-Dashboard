import { toast as notify } from "react-toastify";
import { toastIcons } from "@/utils/toastIcons";
import { formatApiErrorMessage } from "@/utils/apiErrors";

const base = {
  hideProgressBar: true,
  closeButton: true,
};

function optionsFor(type, extra = {}) {
  const variantClass = `arrow-toast arrow-toast--${type}`;
  const { className: extraClass, classNames, ...rest } = extra;
  const opts = {
    ...base,
    ...rest,
    className: extraClass ? `${variantClass} ${extraClass}`.trim() : variantClass,
  };
  if (classNames && typeof classNames === "object") {
    opts.classNames = classNames;
  }
  return opts;
}

function resolvePromiseMessage(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "function") return value;
  return fallback;
}

export const toast = {
  success: (message) =>
    notify.success(message, {
      ...optionsFor("success"),
      icon: toastIcons.success,
    }),

  error: (message) =>
    notify.error(message == null ? "" : String(message), {
      ...optionsFor("error", { autoClose: 5500 }),
      icon: toastIcons.error,
    }),

  warning: (message) =>
    notify.warning(message, {
      ...optionsFor("warning"),
      icon: toastIcons.warning,
    }),

  info: (message) =>
    notify.info(message, {
      ...optionsFor("info"),
      icon: toastIcons.info,
    }),

  dismiss: (id) => notify.dismiss(id),

  promise: (promise, options = {}) => {
    const pending =
      resolvePromiseMessage(options.loading, "Loading…") ?? "Loading…";
    const success =
      resolvePromiseMessage(options.success, "Done") ?? "Done";
    const error =
      resolvePromiseMessage(options.error, "Something went wrong") ??
      "Something went wrong";

    return notify.promise(
      promise,
      {
        pending:
          typeof pending === "function"
            ? { render: pending }
            : pending,
        success:
          typeof success === "function"
            ? { render: success }
            : success,
        error: typeof error === "function" ? { render: error } : error,
      },
      {
        ...base,
        pending: {
          className: "arrow-toast arrow-toast--loading",
          icon: toastIcons.loading,
        },
        success: {
          className: "arrow-toast arrow-toast--success",
          icon: toastIcons.success,
        },
        error: {
          className: "arrow-toast arrow-toast--error",
          icon: toastIcons.error,
          autoClose: 5500,
        },
      }
    );
  },
};

export function getErrorMessage(
  err,
  fallback = "Something went wrong",
  labelForFieldOrFields
) {
  const data = err?.response?.data;
  let labelForField = (k) => k.replace(/_/g, " ");
  if (Array.isArray(labelForFieldOrFields)) {
    const map = Object.fromEntries(
      labelForFieldOrFields.map((f) => [f.name, f.label || f.name]),
    );
    labelForField = (k) => map[k] || k.replace(/_/g, " ");
  } else if (typeof labelForFieldOrFields === "function") {
    labelForField = labelForFieldOrFields;
  }

  const formatted = formatApiErrorMessage(data, labelForField);
  if (formatted) return formatted;
  return fallback;
}
