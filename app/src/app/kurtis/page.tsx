import DesignGroupGrid from "@/components/design-group-grid";
import { kurtiDesignGroups } from "@/data/design-groups";

export default function Page() {
  return (
    <DesignGroupGrid
      title="Kurti Collection"
      subtitle="Each design is grouped together with its available color options from your Kurti folders."
      groups={kurtiDesignGroups}
      slideFromRight
    />
  );
}
