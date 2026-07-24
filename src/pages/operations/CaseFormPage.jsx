import ResourceFormPanel from "@/components/resources/ResourceFormPanel";
import { Box, Stack } from "@mui/material";
import ActionButton from "@/components/common/ActionButton";
import { useParams } from "react-router-dom";
import { useTranslation } from "@/context/LanguageContext";
import { printWorkTicket } from "@/utils/printDocuments";
import { CASE_FIELDS } from "@/pages/operations/caseFormConfig";

const CASE_CREATE_ACTIONS = [
  {
    status: "received",
    labelKey: "pages.cases.createCase",
    defaultLabel: "Create Case",
    intent: "create",
  },
];

export default function CaseFormPage() {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <Box>
      {id ? (
        <Stack direction="row" spacing={1} sx={{ mb: 1.5, justifyContent: "flex-end" }}>
          <ActionButton
            intent="save"
            size="small"
            onClick={() =>
              printWorkTicket({
                case_id: id,
                id,
              })
            }
          >
            {t("pages.cases.printTicket", { defaultValue: "Print work ticket" })}
          </ActionButton>
        </Stack>
      ) : null}
      <ResourceFormPanel
        endpoint="cases"
        fields={CASE_FIELDS}
        listPath="/cases"
        createStatusActions={CASE_CREATE_ACTIONS}
      />
    </Box>
  );
}
