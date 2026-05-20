import DesignGroupGrid from "@/components/design-group-grid";
import { tunicDesignGroups } from "@/data/design-groups";

export default function Page() {
  return (
    <DesignGroupGrid
      title="Tunic Tops Collection"
      subtitle="Each design is grouped together with its available color options from your Tunic folders."
      groups={tunicDesignGroups}
      slideFromRight
    />
  );
}
