// src/components/product-form/DynamicFormField.tsx
import { Controller, Control, Path } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldConfig } from "./form-fiel-config";
import { ProductForm } from "./product-form-schema";

type Props = {
  fieldConfig: FieldConfig;
  control: Control<ProductForm>;
  isLoading?: boolean;
};

export function DynamicFormField({ fieldConfig, control, isLoading }: Props) {
  const { name, label, type = "text", placeholder, rows, options } = fieldConfig;

  const isTextarea = type === "textarea";
  const isSelect = type === "select";
  const maxLength = name === "description" ? 1000 : undefined;

  return (
    <Controller
      name={name as Path<ProductForm>}
      control={control}
      render={({ field, fieldState }) => {
        const rawValue = field.value ?? "";
        const textValue = typeof rawValue === "boolean" ? "" : String(rawValue);

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>
              {label}
              {fieldConfig.isRequired && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FieldLabel>

            {isSelect ? (
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger id={name} aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : isTextarea ? (
              <InputGroup>
                <InputGroupTextarea
                  id={name}
                  placeholder={placeholder}
                  rows={rows || 4}
                  className="min-h-28 resize-none"
                  value={textValue}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  aria-invalid={fieldState.invalid}
                  maxLength={maxLength}
                  disabled={isLoading}
                />
                {maxLength && (
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {textValue.length || 0}/{maxLength}
                    </InputGroupText>
                  </InputGroupAddon>
                )}
              </InputGroup>
            ) : (
              <Input
                type={type}
                id={name}
                placeholder={placeholder}
                value={type === "number" ? (typeof rawValue === "number" ? rawValue : "") : textValue}
                onChange={(e) => {
                  const val = e.target.value;
                  if (type === "number") {
                    field.onChange(val === "" ? "" : Number(val));
                  } else {
                    field.onChange(val);
                  }
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                aria-invalid={fieldState.invalid}
                disabled={isLoading}
              />
            )}

            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}