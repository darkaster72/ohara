import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import FormField from "../form-field";

interface ShippingForm {
  email: string;
  fullName: string;
  city: string;
  state: string;
  address: string;
  country: string;
  phone: string;
  postalCode: string;
}

const FormDefaultValue: ShippingForm = {
  country: "India",
  address: "",
  city: "",
  email: "",
  fullName: "",
  phone: "",
  postalCode: "",
  state: "",
};
export default function ShippingAddress() {
  const { data: session } = useSession();
  const { setValue, handleSubmit, control, formState, getValues } =
    useForm<ShippingForm>({
      defaultValues: FormDefaultValue,
    });
  const onSubmit = (value: ShippingForm) => {
    console.log(value);
  };

  useEffect(() => {
    session?.user.email && setValue("email", session.user.email);
  }, [session]);

  //   console.log("Errors:", formState.errors);
  //   console.log("Fields", getValues());

  return (
    <div className="block">
      <h3 className="block__title">Shipping information</h3>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form__input-row form__input-row--two">
          <FormField control={control} name="email" placeholder="Email" />

          <FormField control={control} name="address" placeholder="Address" />
        </div>

        <div className="form__input-row form__input-row--two">
          <FormField
            control={control}
            name="fullName"
            placeholder="Full Name"
          />

          <FormField control={control} name="city" placeholder="City" />
        </div>

        <div className="form__input-row form__input-row--two">
          <FormField control={control} name="state" placeholder="State" />

          <FormField
            control={control}
            name="postalCode"
            placeholder="Postal Code"
          />
        </div>

        <div className="form__input-row form__input-row--two">
          <FormField control={control} name="phone" placeholder="Phone" />
        </div>
        <button type="submit" className="btn btn--rounded btn--yellow">
          Submit
        </button>
      </form>
    </div>
  );
}
