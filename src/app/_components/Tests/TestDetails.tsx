import { PromptTestResults } from "../../../../shared/types";
import { ItemDetailsProps } from "../ListDetailView";

const TestDetails: React.FC<ItemDetailsProps<PromptTestResults>> = ({
  item: promptTestResults,
}) => {
  return (
    <div>
      <h2>{promptTestResults.id}</h2>
    </div>
  );
};

export default TestDetails;
