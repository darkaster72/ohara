import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";

interface Props<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T, any>;
  placeholder: string;
}

export default function FormField<T extends FieldValues>({
  name,
  control,
  placeholder,
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field, fieldState: { error } }) => {
        error && console.log(error);
        return (
          <div className="form__col">
            <input
              {...field}
              className={`form__input form__input--sm ${error && "error"}`}
              type="text"
              placeholder={placeholder}
            />
          </div>
        );
      }}
    />
  );
}
