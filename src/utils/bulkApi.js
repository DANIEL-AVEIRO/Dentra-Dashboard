import client from "@/api/client";

export async function bulkDelete(endpoint, ids) {
  const { data } = await client.post(`/${endpoint}/bulk-delete/`, { ids });
  return data;
}

export async function bulkAuditLogDelete(ids) {
  const { data } = await client.post("/audit-logs/bulk-delete/", { ids });
  return data;
}

export async function bulkRestore(endpoint, ids) {
  const { data } = await client.post(`/${endpoint}/bulk-restore/`, { ids });
  return data;
}

export async function bulkPermanentDelete(endpoint, ids) {
  const { data } = await client.post(`/${endpoint}/bulk-permanent-delete/`, {
    ids,
  });
  return data;
}

export async function permanentDelete(endpoint, id) {
  await client.post(`/${endpoint}/${id}/permanent-delete/`);
}

export async function bulkUpdate(endpoint, ids, patchData) {
  const { data } = await client.post(`/${endpoint}/bulk-update/`, {
    ids,
    data: patchData,
  });
  return data;
}

/** Toast-friendly summary after a bulk API call */
export function summarizeBulkResult(data, successLabel = "completed") {
  const { succeeded_count = 0, failed_count = 0, failed = [] } = data ?? {};
  const firstError = failed?.[0]?.detail;
  return {
    succeeded_count,
    failed_count,
    firstError,
    allOk: failed_count === 0,
    allFailed: succeeded_count === 0 && failed_count > 0,
    message:
      failed_count === 0
        ? `${succeeded_count} ${successLabel}`
        : succeeded_count === 0
          ? firstError || `All ${failed_count} failed`
          : `${succeeded_count} ${successLabel}, ${failed_count} failed`,
  };
}
