import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { useFieldContext } from "./form"
import { Checkbox } from "@/components/ui/checkbox"
import { FormFieldTitle } from "./comp"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

const FieldCheckbox = ({
  label,
  description,
}: {
  label?: React.ReactNode
  description?: string
}) => {
  const field = useFieldContext<boolean | undefined>()
  const invalid = !field.state.meta.isValid && field.state.meta.isTouched
  return (
    <Field data-invalid={invalid}>
      <div className="flex  gap-2 text-muted-foreground text-xs ">
        <Checkbox
          name={field.name}
          id={`checkbox-${field.name}`}
          aria-invalid={invalid}
          checked={field.state.value}
          onCheckedChange={checked => field.handleChange(checked as boolean)}
        />
        <FieldContent>
          <FieldLabel className="text-xs" htmlFor={`checkbox-${field.name}`}>
            {label}
          </FieldLabel>
          {description && <FieldDescription>{description}</FieldDescription>}
        </FieldContent>
      </div>
      {invalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
const FieldInputGroup = ({
  title,
  description,
  required = false,
  placeholder,
  Addon,
  AddonInlineEnd,
}: {
  title?: string
  description?: string
  required?: boolean
  placeholder?: string
  Addon?: React.ReactNode
  AddonInlineEnd?: React.ReactNode
}) => {
  const field = useFieldContext<string>()
  const invalid = !field.state.meta.isValid && field.state.meta.isTouched
  return (
    <Field data-invalid={invalid}>
      <FormFieldTitle title={title} required={required} />
      <InputGroup>
        <InputGroupInput
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={e => field.handleChange(e.target.value)}
          aria-invalid={invalid}
          placeholder={placeholder}
          // autoComplete="off"
          disabled={false}
        />
        {Addon && <InputGroupAddon>{Addon}</InputGroupAddon>}
        {AddonInlineEnd && (
          <InputGroupAddon align="inline-end">{AddonInlineEnd}</InputGroupAddon>
        )}
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {invalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}
export const fieldComponents = {
  FieldCheckbox,
  FieldInputGroup,
}