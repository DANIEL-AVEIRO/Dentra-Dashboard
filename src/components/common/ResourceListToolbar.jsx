import OpenTrashButton from "@/components/common/OpenTrashButton";
import PageHeader from "@/components/common/PageHeader";

/**
 * List page top banner — uses shared PageHeader (GJM-style).
 */
export default function ResourceListToolbar({
  title,
  subtitle,
  onAdd,
  addLabel,
  showTrash = true,
  trashTo = "/trash",
  extraAction,
}) {
  return (
    <PageHeader
      title={title}
      subtitle={subtitle}
      onAdd={onAdd}
      addLabel={addLabel}
      action={
        <>
          {extraAction}
          {showTrash ? <OpenTrashButton to={trashTo} /> : null}
        </>
      }
    />
  );
}
