import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function CheckboxLabels({ checked, onChange }) {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={onChange}
            size="small"
            color="success"
          />
        }
        label="Show answer"
      />
    </FormGroup>
  );
}
